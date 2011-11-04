/*
 Copyright  2002-2007 MySQL AB, 2008 Sun Microsystems

 This program is free software; you can redistribute it and/or modify
 it under the terms of version 2 of the GNU General Public License as 
 published by the Free Software Foundation.

 There are special exceptions to the terms and conditions of the GPL 
 as it is applied to this software. View the full text of the 
 exception in file EXCEPTIONS-CONNECTOR-J in the directory of this 
 software distribution.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

 */

package com.mysql.jdbc;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.sql.DriverPropertyInfo;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

import javax.naming.RefAddr;
import javax.naming.Reference;
import javax.naming.StringRefAddr;

import com.mysql.jdbc.log.Log;
import com.mysql.jdbc.log.StandardLogger;

/**
 * Represents configurable properties for Connections and DataSources. Can also
 * expose properties as JDBC DriverPropertyInfo if required as well.
 * 
 * @author Mark Matthews
 * @version $Id: ConnectionProperties.java,v 1.1.2.2 2005/05/17 14:58:56
 *          mmatthews Exp $
 */
public class ConnectionPropertiesImpl implements Serializable, ConnectionProperties {
	
	private static final long serialVersionUID = 4257801713007640580L;

	class BooleanConnectionProperty extends ConnectionProperty implements Serializable {
	
		private static final long serialVersionUID = 2540132501709159404L;

		/**
		 * DOCUMENT ME!
		 * 
		 * @param propertyNameToSet
		 * @param defaultValueToSet
		 * @param descriptionToSet
		 *            DOCUMENT ME!
		 * @param sinceVersionToSet
		 *            DOCUMENT ME!
		 */
		BooleanConnectionProperty(String propertyNameToSet,
				boolean defaultValueToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			super(propertyNameToSet, Boolean.valueOf(defaultValueToSet), null, 0,
					0, descriptionToSet, sinceVersionToSet, category,
					orderInCategory);
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#getAllowableValues()
		 */
		String[] getAllowableValues() {
			return new String[] { "true", "false", "yes", "no" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
		}

		boolean getValueAsBoolean() {
			return ((Boolean) this.valueAsObject).booleanValue();
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#hasValueConstraints()
		 */
		boolean hasValueConstraints() {
			return true;
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#initializeFrom(java.util.Properties)
		 */
		void initializeFrom(String extractedValue) throws SQLException {
			if (extractedValue != null) {
				validateStringValues(extractedValue);

				this.valueAsObject = Boolean.valueOf(extractedValue
						.equalsIgnoreCase("TRUE") //$NON-NLS-1$
						|| extractedValue.equalsIgnoreCase("YES")); //$NON-NLS-1$
			} else {
				this.valueAsObject = this.defaultValue;
			}
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#isRangeBased()
		 */
		boolean isRangeBased() {
			return false;
		}

		void setValue(boolean valueFlag) {
			this.valueAsObject = Boolean.valueOf(valueFlag);
		}
	}

	abstract class ConnectionProperty implements Serializable {
		String[] allowableValues;

		String categoryName;

		Object defaultValue;

		int lowerBound;

		int order;

		String propertyName;

		String sinceVersion;

		int upperBound;

		Object valueAsObject;

		boolean required;
		
		String description;
		
		public ConnectionProperty() {}
		
		ConnectionProperty(String propertyNameToSet, Object defaultValueToSet,
				String[] allowableValuesToSet, int lowerBoundToSet,
				int upperBoundToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			
			this.description = descriptionToSet;
			this.propertyName = propertyNameToSet;
			this.defaultValue = defaultValueToSet;
			this.valueAsObject = defaultValueToSet;
			this.allowableValues = allowableValuesToSet;
			this.lowerBound = lowerBoundToSet;
			this.upperBound = upperBoundToSet;
			this.required = false;
			this.sinceVersion = sinceVersionToSet;
			this.categoryName = category;
			this.order = orderInCategory;
		}

		String[] getAllowableValues() {
			return this.allowableValues;
		}

		/**
		 * @return Returns the categoryName.
		 */
		String getCategoryName() {
			return this.categoryName;
		}

		Object getDefaultValue() {
			return this.defaultValue;
		}

		int getLowerBound() {
			return this.lowerBound;
		}

		/**
		 * @return Returns the order.
		 */
		int getOrder() {
			return this.order;
		}

		String getPropertyName() {
			return this.propertyName;
		}

		int getUpperBound() {
			return this.upperBound;
		}

		Object getValueAsObject() {
			return this.valueAsObject;
		}

		abstract boolean hasValueConstraints();

		void initializeFrom(Properties extractFrom) throws SQLException {
			String extractedValue = extractFrom.getProperty(getPropertyName());
			extractFrom.remove(getPropertyName());
			initializeFrom(extractedValue);
		}

		void initializeFrom(Reference ref) throws SQLException {
			RefAddr refAddr = ref.get(getPropertyName());

			if (refAddr != null) {
				String refContentAsString = (String) refAddr.getContent();

				initializeFrom(refContentAsString);
			}
		}

		abstract void initializeFrom(String extractedValue) throws SQLException;

		abstract boolean isRangeBased();

		/**
		 * @param categoryName
		 *            The categoryName to set.
		 */
		void setCategoryName(String categoryName) {
			this.categoryName = categoryName;
		}

		/**
		 * @param order
		 *            The order to set.
		 */
		void setOrder(int order) {
			this.order = order;
		}

		void setValueAsObject(Object obj) {
			this.valueAsObject = obj;
		}

		void storeTo(Reference ref) {
			if (getValueAsObject() != null) {
				ref.add(new StringRefAddr(getPropertyName(), getValueAsObject()
						.toString()));
			}
		}

		DriverPropertyInfo getAsDriverPropertyInfo() {
			DriverPropertyInfo dpi = new DriverPropertyInfo(this.propertyName, null);
			dpi.choices = getAllowableValues();
			dpi.value = (this.valueAsObject != null) ? this.valueAsObject.toString() : null;
			dpi.required = this.required;
			dpi.description = this.description;
			
			return dpi;
		}
		

		void validateStringValues(String valueToValidate) throws SQLException {
			String[] validateAgainst = getAllowableValues();

			if (valueToValidate == null) {
				return;
			}

			if ((validateAgainst == null) || (validateAgainst.length == 0)) {
				return;
			}

			for (int i = 0; i < validateAgainst.length; i++) {
				if ((validateAgainst[i] != null)
						&& validateAgainst[i].equalsIgnoreCase(valueToValidate)) {
					return;
				}
			}

			StringBuffer errorMessageBuf = new StringBuffer();

			errorMessageBuf.append("The connection property '"); //$NON-NLS-1$
			errorMessageBuf.append(getPropertyName());
			errorMessageBuf.append("' only accepts values of the form: "); //$NON-NLS-1$

			if (validateAgainst.length != 0) {
				errorMessageBuf.append("'"); //$NON-NLS-1$
				errorMessageBuf.append(validateAgainst[0]);
				errorMessageBuf.append("'"); //$NON-NLS-1$

				for (int i = 1; i < (validateAgainst.length - 1); i++) {
					errorMessageBuf.append(", "); //$NON-NLS-1$
					errorMessageBuf.append("'"); //$NON-NLS-1$
					errorMessageBuf.append(validateAgainst[i]);
					errorMessageBuf.append("'"); //$NON-NLS-1$
				}

				errorMessageBuf.append(" or '"); //$NON-NLS-1$
				errorMessageBuf
						.append(validateAgainst[validateAgainst.length - 1]);
				errorMessageBuf.append("'"); //$NON-NLS-1$
			}

			errorMessageBuf.append(". The value '"); //$NON-NLS-1$
			errorMessageBuf.append(valueToValidate);
			errorMessageBuf.append("' is not in this set."); //$NON-NLS-1$

			throw SQLError.createSQLException(errorMessageBuf.toString(),
					SQLError.SQL_STATE_ILLEGAL_ARGUMENT, getExceptionInterceptor());
		}
	}

	class IntegerConnectionProperty extends ConnectionProperty implements Serializable {

		private static final long serialVersionUID = -3004305481796850832L;

		public IntegerConnectionProperty(String propertyNameToSet,
				Object defaultValueToSet, String[] allowableValuesToSet,
				int lowerBoundToSet, int upperBoundToSet,
				String descriptionToSet, String sinceVersionToSet,
				String category, int orderInCategory) {
			super(propertyNameToSet, defaultValueToSet, allowableValuesToSet,
					lowerBoundToSet, upperBoundToSet, descriptionToSet, sinceVersionToSet,
					category, orderInCategory);
		}

		int multiplier = 1;

		IntegerConnectionProperty(String propertyNameToSet,
				int defaultValueToSet, int lowerBoundToSet,
				int upperBoundToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			super(propertyNameToSet, new Integer(defaultValueToSet), null,
					lowerBoundToSet, upperBoundToSet, descriptionToSet,
					sinceVersionToSet, category, orderInCategory);
		}

		/**
		 * DOCUMENT ME!
		 * 
		 * @param propertyNameToSet
		 * @param defaultValueToSet
		 * @param descriptionToSet
		 * @param sinceVersionToSet
		 *            DOCUMENT ME!
		 */

		IntegerConnectionProperty(String propertyNameToSet,
				int defaultValueToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			this(propertyNameToSet, defaultValueToSet, 0, 0, descriptionToSet,
					sinceVersionToSet, category, orderInCategory);
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#getAllowableValues()
		 */
		String[] getAllowableValues() {
			return null;
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#getLowerBound()
		 */
		int getLowerBound() {
			return this.lowerBound;
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#getUpperBound()
		 */
		int getUpperBound() {
			return this.upperBound;
		}

		int getValueAsInt() {
			return ((Integer) this.valueAsObject).intValue();
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#hasValueConstraints()
		 */
		boolean hasValueConstraints() {
			return false;
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#initializeFrom(java.lang.String)
		 */
		void initializeFrom(String extractedValue) throws SQLException {
			if (extractedValue != null) {
				try {
					// Parse decimals, too
					int intValue = Double.valueOf(extractedValue).intValue();

					/*
					 * if (isRangeBased()) { if ((intValue < getLowerBound()) ||
					 * (intValue > getUpperBound())) { throw new
					 * SQLException("The connection property '" +
					 * getPropertyName() + "' only accepts integer values in the
					 * range of " + getLowerBound() + " - " + getUpperBound() + ",
					 * the value '" + extractedValue + "' exceeds this range.",
					 * SQLError.SQL_STATE_ILLEGAL_ARGUMENT); } }
					 */
					this.valueAsObject = new Integer(intValue * multiplier);
				} catch (NumberFormatException nfe) {
					throw SQLError.createSQLException("The connection property '" //$NON-NLS-1$
							+ getPropertyName()
							+ "' only accepts integer values. The value '" //$NON-NLS-1$
							+ extractedValue
							+ "' can not be converted to an integer.", //$NON-NLS-1$
							SQLError.SQL_STATE_ILLEGAL_ARGUMENT, getExceptionInterceptor());
				}
			} else {
				this.valueAsObject = this.defaultValue;
			}
		}

		/**
		 * @see com.mysql.jdbc.ConnectionProperties.ConnectionProperty#isRangeBased()
		 */
		boolean isRangeBased() {
			return getUpperBound() != getLowerBound();
		}

		void setValue(int valueFlag) {
			this.valueAsObject = new Integer(valueFlag);
		}
	}
	
	public class LongConnectionProperty extends IntegerConnectionProperty {

		private static final long serialVersionUID = 6068572984340480895L;

		LongConnectionProperty(String propertyNameToSet,
				long defaultValueToSet, long lowerBoundToSet,
				long upperBoundToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			super(propertyNameToSet, new Long(defaultValueToSet), null,
					(int)lowerBoundToSet, (int)upperBoundToSet, descriptionToSet,
					sinceVersionToSet, category, orderInCategory);
		}
		

		LongConnectionProperty(String propertyNameToSet,
				long defaultValueToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			this(propertyNameToSet,
				defaultValueToSet, 0,
				0, descriptionToSet,
				sinceVersionToSet, category, orderInCategory);
		}
		
		void setValue(long value) {
			this.valueAsObject = new Long(value);
		}
		
		long getValueAsLong() {
			return ((Long) this.valueAsObject).longValue();
		}
		
		void initializeFrom(String extractedValue) throws SQLException {
			if (extractedValue != null) {
				try {
					// Parse decimals, too
					long longValue = Double.valueOf(extractedValue).longValue();

					this.valueAsObject = new Long(longValue);
				} catch (NumberFormatException nfe) {
					throw SQLError.createSQLException("The connection property '" //$NON-NLS-1$
							+ getPropertyName()
							+ "' only accepts long integer values. The value '" //$NON-NLS-1$
							+ extractedValue
							+ "' can not be converted to a long integer.", //$NON-NLS-1$
							SQLError.SQL_STATE_ILLEGAL_ARGUMENT, getExceptionInterceptor());
				}
			} else {
				this.valueAsObject = this.defaultValue;
			}
		}
	}
	
	class MemorySizeConnectionProperty extends IntegerConnectionProperty implements Serializable {

		private static final long serialVersionUID = 7351065128998572656L;

		private String valueAsString;
		
		MemorySizeConnectionProperty(String propertyNameToSet,
				int defaultValueToSet, int lowerBoundToSet,
				int upperBoundToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			super(propertyNameToSet, defaultValueToSet, lowerBoundToSet,
					upperBoundToSet, descriptionToSet, sinceVersionToSet,
					category, orderInCategory);
		}

		void initializeFrom(String extractedValue) throws SQLException {
			valueAsString = extractedValue;
			
			if (extractedValue != null) {
				if (extractedValue.endsWith("k") //$NON-NLS-1$
						|| extractedValue.endsWith("K") //$NON-NLS-1$
						|| extractedValue.endsWith("kb") //$NON-NLS-1$
						|| extractedValue.endsWith("Kb") //$NON-NLS-1$
						|| extractedValue.endsWith("kB")) { //$NON-NLS-1$
					multiplier = 1024;
					int indexOfK = StringUtils.indexOfIgnoreCase(
							extractedValue, "k"); //$NON-NLS-1$
					extractedValue = extractedValue.substring(0, indexOfK);
				} else if (extractedValue.endsWith("m") //$NON-NLS-1$
						|| extractedValue.endsWith("M") //$NON-NLS-1$
						|| extractedValue.endsWith("G") //$NON-NLS-1$
						|| extractedValue.endsWith("mb") //$NON-NLS-1$
						|| extractedValue.endsWith("Mb") //$NON-NLS-1$
						|| extractedValue.endsWith("mB")) { //$NON-NLS-1$
					multiplier = 1024 * 1024;
					int indexOfM = StringUtils.indexOfIgnoreCase(
							extractedValue, "m"); //$NON-NLS-1$
					extractedValue = extractedValue.substring(0, indexOfM);
				} else if (extractedValue.endsWith("g") //$NON-NLS-1$
						|| extractedValue.endsWith("G") //$NON-NLS-1$
						|| extractedValue.endsWith("gb") //$NON-NLS-1$
						|| extractedValue.endsWith("Gb") //$NON-NLS-1$
						|| extractedValue.endsWith("gB")) { //$NON-NLS-1$
					multiplier = 1024 * 1024 * 1024;
					int indexOfG = StringUtils.indexOfIgnoreCase(
							extractedValue, "g"); //$NON-NLS-1$
					extractedValue = extractedValue.substring(0, indexOfG);
				}
			}

			super.initializeFrom(extractedValue);
		}

		void setValue(String value) throws SQLException {
			initializeFrom(value);
		}
		
		String getValueAsString() {
			return valueAsString;
		}
	}

	class StringConnectionProperty extends ConnectionProperty implements Serializable {
	
		private static final long serialVersionUID = 5432127962785948272L;

		StringConnectionProperty(String propertyNameToSet,
				String defaultValueToSet, String descriptionToSet,
				String sinceVersionToSet, String category, int orderInCategory) {
			this(propertyNameToSet, defaultValueToSet, null, descriptionToSet,
					sinceVersionToSet, category, orderInCategory);
		}

		/**
		 * DOCUMENT ME!
		 * 
		 * @param propertyNameToSet
		 * @param defaultValueToSet
		 * @param allowableValuesToSet
		 * @param descriptionToSet
		 * @param sinceVersionToSet
		 *            DOCUMENT ME!
		 */
		StringConnectionProperty(String propertyNameToSet,
				String defaultValueToSet, String[] allowableValuesToSet,
				String descriptionToSet, String sinceVersionToSet,
				String category, int orderInCategory) {
			super(propertyNameToSet, defaultValueToSet, allowableValuesToSet,
					0, 0, descriptionToSet, sinceVersionToSet, category,
					orderInCategory);
		}

		String getValueAsString() {
			return (String) this.valueAsObject;
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#hasValueConstraints()
		 */
		boolean hasValueConstraints() {
			return (this.allowableValues != null)
					&& (this.allowableValues.length > 0);
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#initializeFrom(java.util.Properties)
		 */
		void initializeFrom(String extractedValue) throws SQLException {
			if (extractedValue != null) {
				validateStringValues(extractedValue);

				this.valueAsObject = extractedValue;
			} else {
				this.valueAsObject = this.defaultValue;
			}
		}

		/**
		 * @see com.mysql.jdbc.ConnectionPropertiesImpl.ConnectionProperty#isRangeBased()
		 */
		boolean isRangeBased() {
			return false;
		}

		void setValue(String valueFlag) {
			this.valueAsObject = valueFlag;
		}
	}

	private static final String CONNECTION_AND_AUTH_CATEGORY = Messages.getString("ConnectionProperties.categoryConnectionAuthentication"); //$NON-NLS-1$

	private static final String NETWORK_CATEGORY = Messages.getString("ConnectionProperties.categoryNetworking"); //$NON-NLS-1$
	
	private static final String DEBUGING_PROFILING_CATEGORY = Messages.getString("ConnectionProperties.categoryDebuggingProfiling"); //$NON-NLS-1$

	private static final String HA_CATEGORY = Messages.getString("ConnectionProperties.categorryHA"); //$NON-NLS-1$

	private static final String MISC_CATEGORY = Messages.getString("ConnectionProperties.categoryMisc"); //$NON-NLS-1$

	private static final String PERFORMANCE_CATEGORY = Messages.getString("ConnectionProperties.categoryPerformance"); //$NON-NLS-1$
	
	private static final String SECURITY_CATEGORY = Messages.getString("ConnectionProperties.categorySecurity"); //$NON-NLS-1$
	
	private static final String[] PROPERTY_CATEGORIES = new String[] {
		CONNECTION_AND_AUTH_CATEGORY, NETWORK_CATEGORY,
		HA_CATEGORY, SECURITY_CATEGORY,
		PERFORMANCE_CATEGORY, DEBUGING_PROFILING_CATEGORY, MISC_CATEGORY };
	
	private static final ArrayList PROPERTY_LIST = new ArrayList();

	//
	// Yes, this looks goofy, but we're trying to avoid intern()ing here
	//
	private static final String STANDARD_LOGGER_NAME = StandardLogger.class.getName();

	protected static final String ZERO_DATETIME_BEHAVIOR_CONVERT_TO_NULL = "convertToNull"; //$NON-NLS-1$

	protected static final String ZERO_DATETIME_BEHAVIOR_EXCEPTION = "exception"; //$NON-NLS-1$

	protected static final String ZERO_DATETIME_BEHAVIOR_ROUND = "round"; //$NON-NLS-1$

	static {
		try {
			java.lang.reflect.Field[] declaredFields = ConnectionPropertiesImpl.class
					.getDeclaredFields();

			for (int i = 0; i < declaredFields.length; i++) {
				if (ConnectionPropertiesImpl.ConnectionProperty.class
						.isAssignableFrom(declaredFields[i].getType())) {
					PROPERTY_LIST.add(declaredFields[i]);
				}
			}
		} catch (Exception ex) {
			RuntimeException rtEx = new RuntimeException();
			rtEx.initCause(ex);
			
			throw rtEx;
		}
	}

	public ExceptionInterceptor getExceptionInterceptor() {
		return null;
	}
	
	/**
	 * Exposes all ConnectionPropertyInfo instances as DriverPropertyInfo
	 * 
	 * @param info
	 *            the properties to load into these ConnectionPropertyInfo
	 *            instances
	 * @param slotsToReserve
	 *            the number of DPI slots to reserve for 'standard' DPI
	 *            properties (user, host, password, etc)
	 * @return a list of all ConnectionPropertyInfo instances, as
	 *         DriverPropertyInfo
	 * @throws SQLException
	 *             if an error occurs
	 */
	protected static DriverPropertyInfo[] exposeAsDriverPropertyInfo(
			Properties info, int slotsToReserve) throws SQLException {
		return (new ConnectionPropertiesImpl() {
		}).exposeAsDriverPropertyInfoInternal(info, slotsToReserve);
	}

	private BooleanConnectionProperty allowLoadLocalInfile = new BooleanConnectionProperty(
			"allowLoadLocalInfile", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.loadDataLocal"), //$NON-NLS-1$
			"3.0.3", SECURITY_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty allowMultiQueries = new BooleanConnectionProperty(
			"allowMultiQueries", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.allowMultiQueries"), //$NON-NLS-1$
			"3.1.1", SECURITY_CATEGORY, 1); //$NON-NLS-1$

	private BooleanConnectionProperty allowNanAndInf = new BooleanConnectionProperty(
			"allowNanAndInf", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.allowNANandINF"), //$NON-NLS-1$
			"3.1.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty allowUrlInLocalInfile = new BooleanConnectionProperty(
			"allowUrlInLocalInfile", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.allowUrlInLoadLocal"), //$NON-NLS-1$
			"3.1.4", SECURITY_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty alwaysSendSetIsolation = new BooleanConnectionProperty(
			"alwaysSendSetIsolation", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.alwaysSendSetIsolation"), //$NON-NLS-1$
			"3.1.7", PERFORMANCE_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty autoClosePStmtStreams = new BooleanConnectionProperty(
			"autoClosePStmtStreams",  //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.autoClosePstmtStreams"), //$NON-NLS-1$
			"3.1.12", //$NON-NLS-1$
			MISC_CATEGORY,
			Integer.MIN_VALUE);
	
	private BooleanConnectionProperty autoDeserialize = new BooleanConnectionProperty(
			"autoDeserialize", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.autoDeserialize"), //$NON-NLS-1$
			"3.1.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty autoGenerateTestcaseScript = new BooleanConnectionProperty(
			"autoGenerateTestcaseScript", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.autoGenerateTestcaseScript"), "3.1.9", //$NON-NLS-1$ //$NON-NLS-2$
			DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);

	private boolean autoGenerateTestcaseScriptAsBoolean = false;

	private BooleanConnectionProperty autoReconnect = new BooleanConnectionProperty(
			"autoReconnect", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.autoReconnect"), //$NON-NLS-1$
			"1.1", HA_CATEGORY, 0); //$NON-NLS-1$

	private BooleanConnectionProperty autoReconnectForPools = new BooleanConnectionProperty(
			"autoReconnectForPools", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.autoReconnectForPools"), //$NON-NLS-1$
			"3.1.3", HA_CATEGORY, 1); //$NON-NLS-1$

	private boolean autoReconnectForPoolsAsBoolean = false;

	private MemorySizeConnectionProperty blobSendChunkSize = new MemorySizeConnectionProperty(
			"blobSendChunkSize", //$NON-NLS-1$
			1024 * 1024,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.blobSendChunkSize"), //$NON-NLS-1$
			"3.1.9", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty autoSlowLog = new BooleanConnectionProperty(
			"autoSlowLog", true,
			Messages.getString("ConnectionProperties.autoSlowLog"),
			"5.1.4", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty blobsAreStrings = new BooleanConnectionProperty(
            "blobsAreStrings", false,
            "Should the driver always treat BLOBs as Strings - specifically to work around dubious metadata "
            + "returned by the server for GROUP BY clauses?",
            "5.0.8", MISC_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty functionsNeverReturnBlobs = new BooleanConnectionProperty(
            "functionsNeverReturnBlobs", false,
            "Should the driver always treat data from functions returning BLOBs as Strings - specifically to work around dubious metadata "
            + "returned by the server for GROUP BY clauses?",
            "5.0.8", MISC_CATEGORY, Integer.MIN_VALUE);
			
	private BooleanConnectionProperty cacheCallableStatements = new BooleanConnectionProperty(
			"cacheCallableStmts", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.cacheCallableStatements"), //$NON-NLS-1$
			"3.1.2", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty cachePreparedStatements = new BooleanConnectionProperty(
			"cachePrepStmts", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.cachePrepStmts"), //$NON-NLS-1$
			"3.0.10", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty cacheResultSetMetadata = new BooleanConnectionProperty(
			"cacheResultSetMetadata", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.cacheRSMetadata"), //$NON-NLS-1$
			"3.1.1", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private boolean cacheResultSetMetaDataAsBoolean;

	private BooleanConnectionProperty cacheServerConfiguration = new BooleanConnectionProperty(
			"cacheServerConfiguration", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.cacheServerConfiguration"), //$NON-NLS-1$
			"3.1.5", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty callableStatementCacheSize = new IntegerConnectionProperty(
			"callableStmtCacheSize", //$NON-NLS-1$
			100,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.callableStmtCacheSize"), //$NON-NLS-1$
			"3.1.2", PERFORMANCE_CATEGORY, 5); //$NON-NLS-1$

	private BooleanConnectionProperty capitalizeTypeNames = new BooleanConnectionProperty(
			"capitalizeTypeNames", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.capitalizeTypeNames"), //$NON-NLS-1$
			"2.0.7", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private StringConnectionProperty characterEncoding = new StringConnectionProperty(
			"characterEncoding", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.characterEncoding"), //$NON-NLS-1$
			"1.1g", MISC_CATEGORY, 5); //$NON-NLS-1$

	private String characterEncodingAsString = null;

	private StringConnectionProperty characterSetResults = new StringConnectionProperty(
			"characterSetResults", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.characterSetResults"), "3.0.13", //$NON-NLS-1$ //$NON-NLS-2$
			MISC_CATEGORY, 6);
	
	private StringConnectionProperty clientInfoProvider = new StringConnectionProperty(
			"clientInfoProvider", "com.mysql.jdbc.JDBC4CommentClientInfoProvider", //$NON-NLS-1$ //$NON-NLS-2$
			Messages.getString("ConnectionProperties.clientInfoProvider"), //$NON-NLS-1$
			"5.1.0", //$NON-NLS-1$
			DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty clobberStreamingResults = new BooleanConnectionProperty(
			"clobberStreamingResults", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.clobberStreamingResults"), //$NON-NLS-1$
			"3.0.9", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private StringConnectionProperty clobCharacterEncoding = new StringConnectionProperty(
			"clobCharacterEncoding", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.clobCharacterEncoding"), //$NON-NLS-1$
			"5.0.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty compensateOnDuplicateKeyUpdateCounts = new BooleanConnectionProperty(
			"compensateOnDuplicateKeyUpdateCounts",
			false,
			Messages.getString("ConnectionProperties.compensateOnDuplicateKeyUpdateCounts"),
			"5.1.7", MISC_CATEGORY, Integer.MIN_VALUE);
	private StringConnectionProperty connectionCollation = new StringConnectionProperty(
			"connectionCollation", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.connectionCollation"), //$NON-NLS-1$
			"3.0.13", MISC_CATEGORY, 7); //$NON-NLS-1$

	private StringConnectionProperty connectionLifecycleInterceptors = new StringConnectionProperty(
			"connectionLifecycleInterceptors", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.connectionLifecycleInterceptors"),
			"5.1.4", CONNECTION_AND_AUTH_CATEGORY, Integer.MAX_VALUE);

	private IntegerConnectionProperty connectTimeout = new IntegerConnectionProperty(
			"connectTimeout", 0, 0, Integer.MAX_VALUE, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.connectTimeout"), //$NON-NLS-1$
			"3.0.1", CONNECTION_AND_AUTH_CATEGORY, 9); //$NON-NLS-1$

	private BooleanConnectionProperty continueBatchOnError = new BooleanConnectionProperty(
			"continueBatchOnError", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.continueBatchOnError"), //$NON-NLS-1$
			"3.0.3", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty createDatabaseIfNotExist = new BooleanConnectionProperty(
			"createDatabaseIfNotExist", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.createDatabaseIfNotExist"), //$NON-NLS-1$
			"3.1.9", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty defaultFetchSize = new IntegerConnectionProperty("defaultFetchSize", 0, Messages.getString("ConnectionProperties.defaultFetchSize"), "3.1.9", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$

	private BooleanConnectionProperty detectServerPreparedStmts = new BooleanConnectionProperty(
			"useServerPrepStmts", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useServerPrepStmts"), //$NON-NLS-1$
			"3.1.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty dontTrackOpenResources = new BooleanConnectionProperty(
			"dontTrackOpenResources", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.dontTrackOpenResources"), "3.1.7", PERFORMANCE_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$
			Integer.MIN_VALUE);

	private BooleanConnectionProperty dumpQueriesOnException = new BooleanConnectionProperty(
			"dumpQueriesOnException", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.dumpQueriesOnException"), //$NON-NLS-1$
			"3.1.3", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty dynamicCalendars = new BooleanConnectionProperty(
			"dynamicCalendars", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.dynamicCalendars"), //$NON-NLS-1$
			"3.1.5", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty elideSetAutoCommits = new BooleanConnectionProperty(
			"elideSetAutoCommits", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.eliseSetAutoCommit"), //$NON-NLS-1$
			"3.1.3", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty emptyStringsConvertToZero = new BooleanConnectionProperty(
			"emptyStringsConvertToZero", true, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.emptyStringsConvertToZero"), "3.1.8", //$NON-NLS-1$ //$NON-NLS-2$
			MISC_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty emulateLocators = new BooleanConnectionProperty(
			"emulateLocators", false, Messages.getString("ConnectionProperties.emulateLocators"), "3.1.0", MISC_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			Integer.MIN_VALUE);

	private BooleanConnectionProperty emulateUnsupportedPstmts = new BooleanConnectionProperty(
			"emulateUnsupportedPstmts", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.emulateUnsupportedPstmts"), //$NON-NLS-1$
			"3.1.7", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty enablePacketDebug = new BooleanConnectionProperty(
			"enablePacketDebug", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.enablePacketDebug"), //$NON-NLS-1$
			"3.1.3", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty enableQueryTimeouts = new BooleanConnectionProperty(
			"enableQueryTimeouts", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.enableQueryTimeouts"), //$NON-NLS-1$
			"5.0.6", //$NON-NLS-1$
			PERFORMANCE_CATEGORY, Integer.MIN_VALUE);
			
	private BooleanConnectionProperty explainSlowQueries = new BooleanConnectionProperty(
			"explainSlowQueries", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.explainSlowQueries"), //$NON-NLS-1$
			"3.1.2", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private StringConnectionProperty exceptionInterceptors = new StringConnectionProperty(
			"exceptionInterceptors", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.exceptionInterceptors"),
			"5.1.8", MISC_CATEGORY, Integer.MIN_VALUE);
	
	/** When failed-over, set connection to read-only? */
	private BooleanConnectionProperty failOverReadOnly = new BooleanConnectionProperty(
			"failOverReadOnly", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.failoverReadOnly"), //$NON-NLS-1$
			"3.0.12", HA_CATEGORY, 2); //$NON-NLS-1$

	private BooleanConnectionProperty gatherPerformanceMetrics = new BooleanConnectionProperty(
			"gatherPerfMetrics", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.gatherPerfMetrics"), //$NON-NLS-1$
			"3.1.2", DEBUGING_PROFILING_CATEGORY, 1); //$NON-NLS-1$

	private BooleanConnectionProperty generateSimpleParameterMetadata = new BooleanConnectionProperty(
			"generateSimpleParameterMetadata", false, Messages.getString("ConnectionProperties.generateSimpleParameterMetadata"), "5.0.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private boolean highAvailabilityAsBoolean = false;

	private BooleanConnectionProperty holdResultsOpenOverStatementClose = new BooleanConnectionProperty(
			"holdResultsOpenOverStatementClose", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.holdRSOpenOverStmtClose"), //$NON-NLS-1$
			"3.1.7", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty includeInnodbStatusInDeadlockExceptions = new BooleanConnectionProperty(
			"includeInnodbStatusInDeadlockExceptions",
			false,
			"Include the output of \"SHOW ENGINE INNODB STATUS\" in exception messages when deadlock exceptions are detected?",
			"5.0.7", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty ignoreNonTxTables = new BooleanConnectionProperty(
			"ignoreNonTxTables", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.ignoreNonTxTables"), //$NON-NLS-1$
			"3.0.9", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty initialTimeout = new IntegerConnectionProperty(
			"initialTimeout", 2, 1, Integer.MAX_VALUE, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.initialTimeout"), //$NON-NLS-1$
			"1.1", HA_CATEGORY, 5); //$NON-NLS-1$

	private BooleanConnectionProperty isInteractiveClient = new BooleanConnectionProperty(
			"interactiveClient", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.interactiveClient"), //$NON-NLS-1$
			"3.1.0", CONNECTION_AND_AUTH_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty jdbcCompliantTruncation = new BooleanConnectionProperty(
			"jdbcCompliantTruncation", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.jdbcCompliantTruncation"), "3.1.2", MISC_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$
			Integer.MIN_VALUE);

	private boolean jdbcCompliantTruncationForReads = 
		this.jdbcCompliantTruncation.getValueAsBoolean();
	
	protected MemorySizeConnectionProperty largeRowSizeThreshold = new MemorySizeConnectionProperty("largeRowSizeThreshold",
			2048, 0, Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.largeRowSizeThreshold"),
			"5.1.1", PERFORMANCE_CATEGORY, Integer.MIN_VALUE);
	
	private StringConnectionProperty loadBalanceStrategy = new StringConnectionProperty(
			"loadBalanceStrategy", //$NON-NLS-1$
			"random", //$NON-NLS-1$
			new String[] {"random", "bestResponseTime"}, //$NON-NLS-1$ //$NON-NLS-2$
			Messages.getString("ConnectionProperties.loadBalanceStrategy"), //$NON-NLS-1$
			"5.0.6", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private IntegerConnectionProperty loadBalanceBlacklistTimeout = new IntegerConnectionProperty(
			"loadBalanceBlacklistTimeout", 0, //$NON-NLS-1$
			0, Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.loadBalanceBlacklistTimeout"), //$NON-NLS-1$
			"5.1.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private StringConnectionProperty localSocketAddress = new StringConnectionProperty("localSocketAddress", //$NON-NLS-1$
			null, Messages.getString("ConnectionProperties.localSocketAddress"), //$NON-NLS-1$
			"5.0.5", CONNECTION_AND_AUTH_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private MemorySizeConnectionProperty locatorFetchBufferSize = new MemorySizeConnectionProperty(
			"locatorFetchBufferSize", //$NON-NLS-1$
			1024 * 1024,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.locatorFetchBufferSize"), //$NON-NLS-1$
			"3.2.1", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private StringConnectionProperty loggerClassName = new StringConnectionProperty(
			"logger", STANDARD_LOGGER_NAME, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.logger", new Object[] {Log.class.getName(), STANDARD_LOGGER_NAME}), //$NON-NLS-1$
					 "3.1.1", DEBUGING_PROFILING_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$
			0);

	private BooleanConnectionProperty logSlowQueries = new BooleanConnectionProperty(
			"logSlowQueries", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.logSlowQueries"), //$NON-NLS-1$
			"3.1.2", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty logXaCommands = new BooleanConnectionProperty(
			"logXaCommands", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.logXaCommands"), //$NON-NLS-1$
			"5.0.5", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty maintainTimeStats = new BooleanConnectionProperty(
			"maintainTimeStats", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.maintainTimeStats"), "3.1.9", PERFORMANCE_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$
			Integer.MAX_VALUE);

	private boolean maintainTimeStatsAsBoolean = true;

	private IntegerConnectionProperty maxQuerySizeToLog = new IntegerConnectionProperty(
			"maxQuerySizeToLog", //$NON-NLS-1$
			2048,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.maxQuerySizeToLog"), //$NON-NLS-1$
			"3.1.3", DEBUGING_PROFILING_CATEGORY, 4); //$NON-NLS-1$

	private IntegerConnectionProperty maxReconnects = new IntegerConnectionProperty(
			"maxReconnects", //$NON-NLS-1$
			3,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.maxReconnects"), //$NON-NLS-1$
			"1.1", HA_CATEGORY, 4); //$NON-NLS-1$

	private IntegerConnectionProperty retriesAllDown = new IntegerConnectionProperty(
			"retriesAllDown", //$NON-NLS-1$
			120,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.retriesAllDown"), //$NON-NLS-1$
			"5.1.6", HA_CATEGORY, 4); //$NON-NLS-1$

	private IntegerConnectionProperty maxRows = new IntegerConnectionProperty(
			"maxRows", -1, -1, Integer.MAX_VALUE, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.maxRows"), //$NON-NLS-1$
			Messages.getString("ConnectionProperties.allVersions"), MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private int maxRowsAsInt = -1;

	private IntegerConnectionProperty metadataCacheSize = new IntegerConnectionProperty(
			"metadataCacheSize", //$NON-NLS-1$
			50,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.metadataCacheSize"), //$NON-NLS-1$
			"3.1.1", PERFORMANCE_CATEGORY, 5); //$NON-NLS-1$
	
	private IntegerConnectionProperty netTimeoutForStreamingResults = new IntegerConnectionProperty(
			"netTimeoutForStreamingResults", 600, //$NON-NLS-1$
			0, Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.netTimeoutForStreamingResults"), //$NON-NLS-1$
			"5.1.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty noAccessToProcedureBodies = new BooleanConnectionProperty(
			"noAccessToProcedureBodies",
			false,
			"When determining procedure parameter types for CallableStatements, and the connected user "
			+ " can't access procedure bodies through \"SHOW CREATE PROCEDURE\" or select on mysql.proc "
			+ " should the driver instead create basic metadata (all parameters reported as IN VARCHARs,"
			+ " but allowing registerOutParameter() to be called on them anyway) instead "
			+ " of throwing an exception?",
			"5.0.3", MISC_CATEGORY, Integer.MIN_VALUE);
			
	private BooleanConnectionProperty noDatetimeStringSync = new BooleanConnectionProperty(
			"noDatetimeStringSync", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.noDatetimeStringSync"), //$NON-NLS-1$
			"3.1.7", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty noTimezoneConversionForTimeType = new BooleanConnectionProperty(
			"noTimezoneConversionForTimeType", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.noTzConversionForTimeType"), //$NON-NLS-1$
			"5.0.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty nullCatalogMeansCurrent = new BooleanConnectionProperty(
			"nullCatalogMeansCurrent", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.nullCatalogMeansCurrent"), //$NON-NLS-1$
			"3.1.8", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty nullNamePatternMatchesAll = new BooleanConnectionProperty(
			"nullNamePatternMatchesAll", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.nullNamePatternMatchesAll"), //$NON-NLS-1$
			"3.1.8", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty packetDebugBufferSize = new IntegerConnectionProperty(
			"packetDebugBufferSize", //$NON-NLS-1$
			20,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.packetDebugBufferSize"), //$NON-NLS-1$
			"3.1.3", DEBUGING_PROFILING_CATEGORY, 7); //$NON-NLS-1$
	
	private BooleanConnectionProperty padCharsWithSpace = new BooleanConnectionProperty(
			"padCharsWithSpace", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.padCharsWithSpace"), //$NON-NLS-1$
			"5.0.6", //$NON-NLS-1$
			MISC_CATEGORY,
			Integer.MIN_VALUE);

	private BooleanConnectionProperty paranoid = new BooleanConnectionProperty(
			"paranoid", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.paranoid"), //$NON-NLS-1$
			"3.0.1", SECURITY_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty pedantic = new BooleanConnectionProperty(
			"pedantic", false, Messages.getString("ConnectionProperties.pedantic"), "3.0.0", //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			MISC_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty pinGlobalTxToPhysicalConnection = new BooleanConnectionProperty(
			"pinGlobalTxToPhysicalConnection", false, Messages.getString("ConnectionProperties.pinGlobalTxToPhysicalConnection"), //$NON-NLS-1$
			"5.0.1", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty populateInsertRowWithDefaultValues = new BooleanConnectionProperty(
			"populateInsertRowWithDefaultValues", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.populateInsertRowWithDefaultValues"), //$NON-NLS-1$
			"5.0.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private IntegerConnectionProperty preparedStatementCacheSize = new IntegerConnectionProperty(
			"prepStmtCacheSize", 25, 0, Integer.MAX_VALUE, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.prepStmtCacheSize"), //$NON-NLS-1$
			"3.0.10", PERFORMANCE_CATEGORY, 10); //$NON-NLS-1$

	private IntegerConnectionProperty preparedStatementCacheSqlLimit = new IntegerConnectionProperty(
			"prepStmtCacheSqlLimit", //$NON-NLS-1$
			256,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.prepStmtCacheSqlLimit"), //$NON-NLS-1$
			"3.0.10", PERFORMANCE_CATEGORY, 11); //$NON-NLS-1$

	private BooleanConnectionProperty processEscapeCodesForPrepStmts = 
		new BooleanConnectionProperty("processEscapeCodesForPrepStmts", //$NON-NLS-1$
				true,
				Messages.getString("ConnectionProperties.processEscapeCodesForPrepStmts"), //$NON-NLS-1$
				"3.1.12", //$NON-NLS-1$
				MISC_CATEGORY, Integer.MIN_VALUE);
	
	private StringConnectionProperty profilerEventHandler = new StringConnectionProperty(
			"profilerEventHandler",
			"com.mysql.jdbc.profiler.LoggingProfilerEventHandler",
			Messages.getString("ConnectionProperties.profilerEventHandler"),
			"5.1.6", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
			
	private StringConnectionProperty profileSql = new StringConnectionProperty(
			"profileSql", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.profileSqlDeprecated"), //$NON-NLS-1$
			"2.0.14", DEBUGING_PROFILING_CATEGORY, 3); //$NON-NLS-1$

	private BooleanConnectionProperty profileSQL = new BooleanConnectionProperty(
			"profileSQL", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.profileSQL"), //$NON-NLS-1$
			"3.1.0", DEBUGING_PROFILING_CATEGORY, 1); //$NON-NLS-1$

	private boolean profileSQLAsBoolean = false;

	private StringConnectionProperty propertiesTransform = new StringConnectionProperty(
			NonRegisteringDriver.PROPERTIES_TRANSFORM_KEY,
			null,
			Messages.getString("ConnectionProperties.connectionPropertiesTransform"), //$NON-NLS-1$
			"3.1.4", CONNECTION_AND_AUTH_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty queriesBeforeRetryMaster = new IntegerConnectionProperty(
			"queriesBeforeRetryMaster", //$NON-NLS-1$
			50,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.queriesBeforeRetryMaster"), //$NON-NLS-1$
			"3.0.2", HA_CATEGORY, 7); //$NON-NLS-1$

	private BooleanConnectionProperty queryTimeoutKillsConnection = new BooleanConnectionProperty(
			"queryTimeoutKillsConnection", false, 
			Messages.getString("ConnectionProperties.queryTimeoutKillsConnection"), "5.1.9", MISC_CATEGORY, Integer.MIN_VALUE);
			
	private BooleanConnectionProperty reconnectAtTxEnd = new BooleanConnectionProperty(
			"reconnectAtTxEnd", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.reconnectAtTxEnd"), "3.0.10", //$NON-NLS-1$ //$NON-NLS-2$
			HA_CATEGORY, 4);

	private boolean reconnectTxAtEndAsBoolean = false;

	private BooleanConnectionProperty relaxAutoCommit = new BooleanConnectionProperty(
			"relaxAutoCommit", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.relaxAutoCommit"), //$NON-NLS-1$
			"2.0.13", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty reportMetricsIntervalMillis = new IntegerConnectionProperty(
			"reportMetricsIntervalMillis", //$NON-NLS-1$
			30000,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.reportMetricsIntervalMillis"), //$NON-NLS-1$
			"3.1.2", DEBUGING_PROFILING_CATEGORY, 3); //$NON-NLS-1$

	private BooleanConnectionProperty requireSSL = new BooleanConnectionProperty(
			"requireSSL", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.requireSSL"), //$NON-NLS-1$
			"3.1.0", SECURITY_CATEGORY, 3); //$NON-NLS-1$

	private StringConnectionProperty resourceId = new StringConnectionProperty(
			"resourceId", //$NON-NLS-1$
			null, Messages.getString("ConnectionProperties.resourceId"), //$NON-NLS-1$
			"5.0.1", //$NON-NLS-1$
			HA_CATEGORY,
			Integer.MIN_VALUE);
	
	private IntegerConnectionProperty resultSetSizeThreshold = new IntegerConnectionProperty("resultSetSizeThreshold", 100, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.resultSetSizeThreshold"), "5.0.5", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$
			
	private BooleanConnectionProperty retainStatementAfterResultSetClose = new BooleanConnectionProperty(
			"retainStatementAfterResultSetClose", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.retainStatementAfterResultSetClose"), //$NON-NLS-1$
			"3.1.11", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty rewriteBatchedStatements = new BooleanConnectionProperty(
			"rewriteBatchedStatements", //$NON-NLS-1$
			false, 
			Messages.getString("ConnectionProperties.rewriteBatchedStatements"), //$NON-NLS-1$
			"3.1.13", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty rollbackOnPooledClose = new BooleanConnectionProperty(
			"rollbackOnPooledClose", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.rollbackOnPooledClose"), //$NON-NLS-1$
			"3.0.15", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty roundRobinLoadBalance = new BooleanConnectionProperty(
			"roundRobinLoadBalance", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.roundRobinLoadBalance"), //$NON-NLS-1$
			"3.1.2", HA_CATEGORY, 5); //$NON-NLS-1$

	private BooleanConnectionProperty runningCTS13 = new BooleanConnectionProperty(
			"runningCTS13", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.runningCTS13"), //$NON-NLS-1$
			"3.1.7", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private IntegerConnectionProperty secondsBeforeRetryMaster = new IntegerConnectionProperty(
			"secondsBeforeRetryMaster", //$NON-NLS-1$
			30,
			1,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.secondsBeforeRetryMaster"), //$NON-NLS-1$
			"3.0.2", HA_CATEGORY, 8); //$NON-NLS-1$

	private IntegerConnectionProperty selfDestructOnPingSecondsLifetime = new IntegerConnectionProperty(
			"selfDestructOnPingSecondsLifetime",
			0,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.selfDestructOnPingSecondsLifetime"),
			"5.1.6", HA_CATEGORY, Integer.MAX_VALUE);
	
	private IntegerConnectionProperty selfDestructOnPingMaxOperations = new IntegerConnectionProperty(
			"selfDestructOnPingMaxOperations",
			0,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.selfDestructOnPingMaxOperations"),
			"5.1.6", HA_CATEGORY, Integer.MAX_VALUE);
			
	private StringConnectionProperty serverTimezone = new StringConnectionProperty(
			"serverTimezone", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.serverTimezone"), //$NON-NLS-1$
			"3.0.2", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private StringConnectionProperty sessionVariables = new StringConnectionProperty(
			"sessionVariables", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.sessionVariables"), "3.1.8", //$NON-NLS-1$ //$NON-NLS-2$
			MISC_CATEGORY, Integer.MAX_VALUE);

	private IntegerConnectionProperty slowQueryThresholdMillis = new IntegerConnectionProperty(
			"slowQueryThresholdMillis", //$NON-NLS-1$
			2000,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.slowQueryThresholdMillis"), //$NON-NLS-1$
			"3.1.2", DEBUGING_PROFILING_CATEGORY, 9); //$NON-NLS-1$
	
	private LongConnectionProperty slowQueryThresholdNanos = new LongConnectionProperty(
			"slowQueryThresholdNanos", //$NON-NLS-1$
			0,
			Messages.getString("ConnectionProperties.slowQueryThresholdNanos"), //$NON-NLS-1$
			"5.0.7", //$NON-NLS-1$
			DEBUGING_PROFILING_CATEGORY,
			10);
	
	private StringConnectionProperty socketFactoryClassName = new StringConnectionProperty(
			"socketFactory", //$NON-NLS-1$
			StandardSocketFactory.class.getName(),
			Messages.getString("ConnectionProperties.socketFactory"), //$NON-NLS-1$
			"3.0.3", CONNECTION_AND_AUTH_CATEGORY, 4); //$NON-NLS-1$

	private IntegerConnectionProperty socketTimeout = new IntegerConnectionProperty(
			"socketTimeout", //$NON-NLS-1$
			0,
			0,
			Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.socketTimeout"), //$NON-NLS-1$
			"3.0.1", CONNECTION_AND_AUTH_CATEGORY, 10); //$NON-NLS-1$
	
	private StringConnectionProperty statementInterceptors = new StringConnectionProperty("statementInterceptors", //$NON-NLS-1$
			null, Messages.getString("ConnectionProperties.statementInterceptors"), "5.1.1", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$
	
	private BooleanConnectionProperty strictFloatingPoint = new BooleanConnectionProperty(
			"strictFloatingPoint", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.strictFloatingPoint"), "3.0.0", //$NON-NLS-1$ //$NON-NLS-2$
			MISC_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty strictUpdates = new BooleanConnectionProperty(
			"strictUpdates", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.strictUpdates"), //$NON-NLS-1$
			"3.0.4", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty overrideSupportsIntegrityEnhancementFacility =
		new BooleanConnectionProperty("overrideSupportsIntegrityEnhancementFacility", //$NON-NLS-1$
				false,
				Messages.getString("ConnectionProperties.overrideSupportsIEF"), //$NON-NLS-1$
				"3.1.12", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty tcpNoDelay = new BooleanConnectionProperty(
			StandardSocketFactory.TCP_NO_DELAY_PROPERTY_NAME,
			Boolean.valueOf(StandardSocketFactory.TCP_NO_DELAY_DEFAULT_VALUE).booleanValue(),
			Messages.getString("ConnectionProperties.tcpNoDelay"), //$NON-NLS-1$
			"5.0.7", NETWORK_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty tcpKeepAlive = new BooleanConnectionProperty(
			StandardSocketFactory.TCP_KEEP_ALIVE_PROPERTY_NAME,
			Boolean.valueOf(StandardSocketFactory.TCP_KEEP_ALIVE_DEFAULT_VALUE).booleanValue(),
			Messages.getString("ConnectionProperties.tcpKeepAlive"), //$NON-NLS-1$
			"5.0.7", NETWORK_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private IntegerConnectionProperty tcpRcvBuf = new IntegerConnectionProperty(
			StandardSocketFactory.TCP_RCV_BUF_PROPERTY_NAME,
			Integer.parseInt(StandardSocketFactory.TCP_RCV_BUF_DEFAULT_VALUE),
			0, Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.tcpSoRcvBuf"), //$NON-NLS-1$
			"5.0.7", NETWORK_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private IntegerConnectionProperty tcpSndBuf = new IntegerConnectionProperty(
			StandardSocketFactory.TCP_SND_BUF_PROPERTY_NAME,
			Integer.parseInt(StandardSocketFactory.TCP_SND_BUF_DEFAULT_VALUE),
			0, Integer.MAX_VALUE,
			Messages.getString("ConnectionProperties.tcpSoSndBuf"), //$NON-NLS-1$
			"5.0.7", NETWORK_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
			
	private IntegerConnectionProperty tcpTrafficClass = new IntegerConnectionProperty(
			StandardSocketFactory.TCP_TRAFFIC_CLASS_PROPERTY_NAME,
			Integer.parseInt(StandardSocketFactory.TCP_TRAFFIC_CLASS_DEFAULT_VALUE),
			0, 255,
			Messages.getString("ConnectionProperties.tcpTrafficClass"), //$NON-NLS-1$
			"5.0.7", NETWORK_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty tinyInt1isBit = new BooleanConnectionProperty(
			"tinyInt1isBit", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.tinyInt1isBit"), //$NON-NLS-1$
			"3.0.16", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty traceProtocol = new BooleanConnectionProperty(
			"traceProtocol", false, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.traceProtocol"), "3.1.2", //$NON-NLS-1$ //$NON-NLS-2$
			DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty treatUtilDateAsTimestamp = new BooleanConnectionProperty(
			"treatUtilDateAsTimestamp", true, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.treatUtilDateAsTimestamp"), //$NON-NLS-1$
			"5.0.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty transformedBitIsBoolean = new BooleanConnectionProperty(
			"transformedBitIsBoolean", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.transformedBitIsBoolean"), //$NON-NLS-1$
			"3.1.9", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useBlobToStoreUTF8OutsideBMP = new BooleanConnectionProperty(
			"useBlobToStoreUTF8OutsideBMP",
			false,
			Messages.getString("ConnectionProperties.useBlobToStoreUTF8OutsideBMP"), //$NON-NLS-1$
			"5.1.3", MISC_CATEGORY, 128);
	
	private StringConnectionProperty utf8OutsideBmpExcludedColumnNamePattern = new StringConnectionProperty(
			"utf8OutsideBmpExcludedColumnNamePattern",
			null,
			Messages.getString("ConnectionProperties.utf8OutsideBmpExcludedColumnNamePattern"), //$NON-NLS-1$
			"5.1.3", MISC_CATEGORY, 129);
	
	private StringConnectionProperty utf8OutsideBmpIncludedColumnNamePattern = new StringConnectionProperty(
			"utf8OutsideBmpIncludedColumnNamePattern",
			null,
			Messages.getString("ConnectionProperties.utf8OutsideBmpIncludedColumnNamePattern"), //$NON-NLS-1$
			"5.1.3", MISC_CATEGORY, 129);
	
	private BooleanConnectionProperty useCompression = new BooleanConnectionProperty(
			"useCompression", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useCompression"), //$NON-NLS-1$
			"3.0.17", CONNECTION_AND_AUTH_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useColumnNamesInFindColumn = new BooleanConnectionProperty(
			"useColumnNamesInFindColumn",
			false, 
			Messages.getString("ConnectionProperties.useColumnNamesInFindColumn"), //$NON-NLS-1$
			"5.1.7", MISC_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$
	
	private StringConnectionProperty useConfigs = new StringConnectionProperty(
			"useConfigs", //$NON-NLS-1$
			null,
			Messages.getString("ConnectionProperties.useConfigs"), //$NON-NLS-1$
			"3.1.5", CONNECTION_AND_AUTH_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useCursorFetch = new BooleanConnectionProperty(
			"useCursorFetch", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useCursorFetch"), //$NON-NLS-1$
			"5.0.0", PERFORMANCE_CATEGORY, Integer.MAX_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty useDynamicCharsetInfo = new BooleanConnectionProperty(
			"useDynamicCharsetInfo", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useDynamicCharsetInfo") //$NON-NLS-1$
			, "5.0.6", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty useDirectRowUnpack = new BooleanConnectionProperty(
			"useDirectRowUnpack",
			true, "Use newer result set row unpacking code that skips a copy from network buffers "
			+ " to a MySQL packet instance and instead reads directly into the result set row data buffers.",
			"5.1.1", PERFORMANCE_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty useFastIntParsing = new BooleanConnectionProperty(
			"useFastIntParsing", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useFastIntParsing"), //$NON-NLS-1$
			"3.1.4", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useFastDateParsing = new BooleanConnectionProperty(
			"useFastDateParsing", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useFastDateParsing"), //$NON-NLS-1$
			"5.0.5", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty useHostsInPrivileges = new BooleanConnectionProperty(
			"useHostsInPrivileges", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useHostsInPrivileges"), //$NON-NLS-1$
			"3.0.2", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	private BooleanConnectionProperty useInformationSchema = new BooleanConnectionProperty(
			"useInformationSchema", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useInformationSchema"), //$NON-NLS-1$
			"5.0.0", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	private BooleanConnectionProperty useJDBCCompliantTimezoneShift = new BooleanConnectionProperty(
			"useJDBCCompliantTimezoneShift", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useJDBCCompliantTimezoneShift"), //$NON-NLS-1$
			"5.0.0", //$NON-NLS-1$
			MISC_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty useLocalSessionState = new BooleanConnectionProperty(
			"useLocalSessionState", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useLocalSessionState"), //$NON-NLS-1$
			"3.1.7", PERFORMANCE_CATEGORY, 5); //$NON-NLS-1$
	
	private BooleanConnectionProperty useLocalTransactionState = new BooleanConnectionProperty(
			"useLocalTransactionState", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useLocalTransactionState"),
			"5.1.7", PERFORMANCE_CATEGORY, 6);
	
	private BooleanConnectionProperty useLegacyDatetimeCode = new BooleanConnectionProperty(
			"useLegacyDatetimeCode",
			true,
			Messages.getString("ConnectionProperties.useLegacyDatetimeCode"),
			"5.1.6", MISC_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty useNanosForElapsedTime = new BooleanConnectionProperty(
			"useNanosForElapsedTime", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useNanosForElapsedTime"), //$NON-NLS-1$
			"5.0.7", //$NON-NLS-1$
			DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE);
	
	private BooleanConnectionProperty useOldAliasMetadataBehavior = new BooleanConnectionProperty(
			"useOldAliasMetadataBehavior", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useOldAliasMetadataBehavior"), //$NON-NLS-1$
		    "5.0.4", //$NON-NLS-1$
		    MISC_CATEGORY,
		    Integer.MIN_VALUE);
	
	private BooleanConnectionProperty useOldUTF8Behavior = new BooleanConnectionProperty(
			"useOldUTF8Behavior", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useOldUtf8Behavior"), //$NON-NLS-1$
			"3.1.6", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private boolean useOldUTF8BehaviorAsBoolean = false;

	private BooleanConnectionProperty useOnlyServerErrorMessages = new BooleanConnectionProperty(
			"useOnlyServerErrorMessages", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useOnlyServerErrorMessages"), //$NON-NLS-1$
			"3.0.15", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useReadAheadInput = new BooleanConnectionProperty(
			"useReadAheadInput", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useReadAheadInput"), //$NON-NLS-1$
			"3.1.5", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useSqlStateCodes = new BooleanConnectionProperty(
			"useSqlStateCodes", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useSqlStateCodes"), //$NON-NLS-1$
			"3.1.3", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useSSL = new BooleanConnectionProperty(
			"useSSL", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useSSL"), //$NON-NLS-1$
			"3.0.2", SECURITY_CATEGORY, 2); //$NON-NLS-1$

	private BooleanConnectionProperty useSSPSCompatibleTimezoneShift = new BooleanConnectionProperty(
			"useSSPSCompatibleTimezoneShift", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useSSPSCompatibleTimezoneShift"), //$NON-NLS-1$
			"5.0.5", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$
	
	private BooleanConnectionProperty useStreamLengthsInPrepStmts = new BooleanConnectionProperty(
			"useStreamLengthsInPrepStmts", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useStreamLengthsInPrepStmts"), //$NON-NLS-1$
			"3.0.2", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useTimezone = new BooleanConnectionProperty(
			"useTimezone", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useTimezone"), //$NON-NLS-1$
			"3.0.2", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useUltraDevWorkAround = new BooleanConnectionProperty(
			"ultraDevHack", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.ultraDevHack"), //$NON-NLS-1$
			"2.0.3", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useUnbufferedInput = new BooleanConnectionProperty(
			"useUnbufferedInput", true, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.useUnbufferedInput"), //$NON-NLS-1$
			"3.0.11", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private BooleanConnectionProperty useUnicode = new BooleanConnectionProperty(
			"useUnicode", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.useUnicode"), //$NON-NLS-1$
			"1.1g", MISC_CATEGORY, 0); //$NON-NLS-1$

	// Cache these values, they are 'hot'
	private boolean useUnicodeAsBoolean = true;

	private BooleanConnectionProperty useUsageAdvisor = new BooleanConnectionProperty(
			"useUsageAdvisor", //$NON-NLS-1$
			false,
			Messages.getString("ConnectionProperties.useUsageAdvisor"), //$NON-NLS-1$
			"3.1.1", DEBUGING_PROFILING_CATEGORY, 10); //$NON-NLS-1$

	private boolean useUsageAdvisorAsBoolean = false;

	private BooleanConnectionProperty yearIsDateType = new BooleanConnectionProperty(
			"yearIsDateType", //$NON-NLS-1$
			true,
			Messages.getString("ConnectionProperties.yearIsDateType"), //$NON-NLS-1$
			"3.1.9", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$

	private StringConnectionProperty zeroDateTimeBehavior = new StringConnectionProperty(
			"zeroDateTimeBehavior", //$NON-NLS-1$
			ZERO_DATETIME_BEHAVIOR_EXCEPTION,
			new String[] { ZERO_DATETIME_BEHAVIOR_EXCEPTION,
					ZERO_DATETIME_BEHAVIOR_ROUND,
					ZERO_DATETIME_BEHAVIOR_CONVERT_TO_NULL },
			Messages.getString("ConnectionProperties.zeroDateTimeBehavior", new Object[] {ZERO_DATETIME_BEHAVIOR_EXCEPTION, ZERO_DATETIME_BEHAVIOR_ROUND,ZERO_DATETIME_BEHAVIOR_CONVERT_TO_NULL}),  //$NON-NLS-1$
			"3.1.4", //$NON-NLS-1$ //$NON-NLS-2$
			MISC_CATEGORY, Integer.MIN_VALUE);

	private BooleanConnectionProperty useJvmCharsetConverters = new BooleanConnectionProperty("useJvmCharsetConverters", //$NON-NLS-1$
			false, Messages.getString("ConnectionProperties.useJvmCharsetConverters"), "5.0.1", PERFORMANCE_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$
	
	private BooleanConnectionProperty useGmtMillisForDatetimes = new BooleanConnectionProperty("useGmtMillisForDatetimes", false, Messages.getString("ConnectionProperties.useGmtMillisForDatetimes"), "3.1.12", MISC_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$

	private BooleanConnectionProperty dumpMetadataOnColumnNotFound = new BooleanConnectionProperty("dumpMetadataOnColumnNotFound", false, Messages.getString("ConnectionProperties.dumpMetadataOnColumnNotFound"), "3.1.13", DEBUGING_PROFILING_CATEGORY, Integer.MIN_VALUE); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$

	// SSL Options
	
	private StringConnectionProperty clientCertificateKeyStoreUrl = new StringConnectionProperty(
			"clientCertificateKeyStoreUrl", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.clientCertificateKeyStoreUrl"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 5);
	
	private StringConnectionProperty trustCertificateKeyStoreUrl = new StringConnectionProperty(
			"trustCertificateKeyStoreUrl", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.trustCertificateKeyStoreUrl"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 8);
	
	private StringConnectionProperty clientCertificateKeyStoreType = new StringConnectionProperty(
			"clientCertificateKeyStoreType", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.clientCertificateKeyStoreType"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 6);
	
	private StringConnectionProperty clientCertificateKeyStorePassword = new StringConnectionProperty(
			"clientCertificateKeyStorePassword", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.clientCertificateKeyStorePassword"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 7);
	
	private StringConnectionProperty trustCertificateKeyStoreType = new StringConnectionProperty(
			"trustCertificateKeyStoreType", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.trustCertificateKeyStoreType"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 9);
	
	private StringConnectionProperty trustCertificateKeyStorePassword = new StringConnectionProperty(
			"trustCertificateKeyStorePassword", null, //$NON-NLS-1$
			Messages.getString("ConnectionProperties.trustCertificateKeyStorePassword"), "5.1.0", //$NON-NLS-1$ //$NON-NLS-2$
			SECURITY_CATEGORY, 10);

	private BooleanConnectionProperty verifyServerCertificate = new BooleanConnectionProperty(
			"verifyServerCertificate",
			true,
			Messages.getString("ConnectionProperties.verifyServerCertificate"),
			"5.1.6", SECURITY_CATEGORY, 4);
	
	private BooleanConnectionProperty useAffectedRows = new BooleanConnectionProperty("useAffectedRows",
			false,
			Messages.getString("ConnectionProperties.useAffectedRows"),
			"5.1.7", MISC_CATEGORY, Integer.MIN_VALUE);
	
	private StringConnectionProperty passwordCharacterEncoding = new StringConnectionProperty("passwordCharacterEncoding",
			null,
			Messages.getString("ConnectionProperties.passwordCharacterEncoding"),
			"5.1.7", SECURITY_CATEGORY, Integer.MIN_VALUE);
	
	private IntegerConnectionProperty maxAllowedPacket = new IntegerConnectionProperty("maxAllowedPacket",
			-1, Messages.getString("ConnectionProperties.maxAllowedPacket"), "5.1.8", NETWORK_CATEGORY,
			Integer.MIN_VALUE);
	
	protected DriverPropertyInfo[] exposeAsDriverPropertyInfoInternal(
			Properties info, int slotsToReserve) throws SQLException {
		initializeProperties(info);

		int numProperties = PROPERTY_LIST.size();

		int listSize = numProperties + slotsToReserve;

		DriverPropertyInfo[] driverProperties = new DriverPropertyInfo[listSize];

		for (int i = slotsToReserve; i < listSize; i++) {
			java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
					.get(i - slotsToReserve);

			try {
				ConnectionProperty propToExpose = (ConnectionProperty) propertyField
						.get(this);

				if (info != null) {
					propToExpose.initializeFrom(info);
				}

				
				driverProperties[i] = propToExpose.getAsDriverPropertyInfo();
			} catch (IllegalAccessException iae) {
				throw SQLError.createSQLException(Messages.getString("ConnectionProperties.InternalPropertiesFailure"), //$NON-NLS-1$
						SQLError.SQL_STATE_GENERAL_ERROR, getExceptionInterceptor());
			}
		}

		return driverProperties;
	}

	protected Properties exposeAsProperties(Properties info)
			throws SQLException {
		if (info == null) {
			info = new Properties();
		}

		int numPropertiesToSet = PROPERTY_LIST.size();

		for (int i = 0; i < numPropertiesToSet; i++) {
			java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
					.get(i);

			try {
				ConnectionProperty propToGet = (ConnectionProperty) propertyField
						.get(this);

				Object propValue = propToGet.getValueAsObject();

				if (propValue != null) {
					info.setProperty(propToGet.getPropertyName(), propValue
							.toString());
				}
			} catch (IllegalAccessException iae) {
				throw SQLError.createSQLException("Internal properties failure", //$NON-NLS-1$
						SQLError.SQL_STATE_GENERAL_ERROR, getExceptionInterceptor());
			}
		}

		return info;
	}

	
	public String exposeAsXml() throws SQLException {
		StringBuffer xmlBuf = new StringBuffer();
		xmlBuf.append("<ConnectionProperties>"); //$NON-NLS-1$

		int numPropertiesToSet = PROPERTY_LIST.size();

		int numCategories = PROPERTY_CATEGORIES.length;

		Map propertyListByCategory = new HashMap();

		for (int i = 0; i < numCategories; i++) {
			propertyListByCategory.put(PROPERTY_CATEGORIES[i], new Map[] {
					new TreeMap(), new TreeMap() });
		}

		//
		// The following properties are not exposed as 'normal' properties, but
		// they are
		// settable nonetheless, so we need to have them documented, make sure
		// that they sort 'first' as #1 and #2 in the category
		//
		StringConnectionProperty userProp = new StringConnectionProperty(
				NonRegisteringDriver.USER_PROPERTY_KEY, null,
				Messages.getString("ConnectionProperties.Username"), Messages.getString("ConnectionProperties.allVersions"), CONNECTION_AND_AUTH_CATEGORY, //$NON-NLS-1$ //$NON-NLS-2$
				Integer.MIN_VALUE + 1);
		StringConnectionProperty passwordProp = new StringConnectionProperty(
				NonRegisteringDriver.PASSWORD_PROPERTY_KEY, null,
				Messages.getString("ConnectionProperties.Password"), Messages.getString("ConnectionProperties.allVersions"), //$NON-NLS-1$ //$NON-NLS-2$
				CONNECTION_AND_AUTH_CATEGORY, Integer.MIN_VALUE + 2);

		Map[] connectionSortMaps = (Map[]) propertyListByCategory
				.get(CONNECTION_AND_AUTH_CATEGORY);
		TreeMap userMap = new TreeMap();
		userMap.put(userProp.getPropertyName(), userProp);
		
		connectionSortMaps[0].put(new Integer(userProp.getOrder()), userMap);
		
		TreeMap passwordMap = new TreeMap();
		passwordMap.put(passwordProp.getPropertyName(), passwordProp);
		
		connectionSortMaps[0]
				.put(new Integer(passwordProp.getOrder()), passwordMap);

		try {
			for (int i = 0; i < numPropertiesToSet; i++) {
				java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
						.get(i);
				ConnectionProperty propToGet = (ConnectionProperty) propertyField
						.get(this);
				Map[] sortMaps = (Map[]) propertyListByCategory.get(propToGet
						.getCategoryName());
				int orderInCategory = propToGet.getOrder();

				if (orderInCategory == Integer.MIN_VALUE) {
					sortMaps[1].put(propToGet.getPropertyName(), propToGet);
				} else {
					Integer order = new Integer(orderInCategory);
					
					Map orderMap = (Map)sortMaps[0].get(order);
					
					if (orderMap == null) {
						orderMap = new TreeMap();
						sortMaps[0].put(order, orderMap);
					}
					
					orderMap.put(propToGet.getPropertyName(), propToGet);
				}
			}

			for (int j = 0; j < numCategories; j++) {
				Map[] sortMaps = (Map[]) propertyListByCategory
						.get(PROPERTY_CATEGORIES[j]);
				Iterator orderedIter = sortMaps[0].values().iterator();
				Iterator alphaIter = sortMaps[1].values().iterator();

				xmlBuf.append("\n <PropertyCategory name=\""); //$NON-NLS-1$
				xmlBuf.append(PROPERTY_CATEGORIES[j]);
				xmlBuf.append("\">"); //$NON-NLS-1$

				while (orderedIter.hasNext()) {
					Iterator orderedAlphaIter = ((Map)orderedIter.next()).values().iterator();
					
					while (orderedAlphaIter.hasNext()) {
						ConnectionProperty propToGet = (ConnectionProperty) orderedAlphaIter
								.next();
						
						xmlBuf.append("\n  <Property name=\""); //$NON-NLS-1$
						xmlBuf.append(propToGet.getPropertyName());
						xmlBuf.append("\" required=\""); //$NON-NLS-1$
						xmlBuf.append(propToGet.required ? "Yes" : "No"); //$NON-NLS-1$ //$NON-NLS-2$
	
						xmlBuf.append("\" default=\""); //$NON-NLS-1$
	
						if (propToGet.getDefaultValue() != null) {
							xmlBuf.append(propToGet.getDefaultValue());
						}
	
						xmlBuf.append("\" sortOrder=\""); //$NON-NLS-1$
						xmlBuf.append(propToGet.getOrder());
						xmlBuf.append("\" since=\""); //$NON-NLS-1$
						xmlBuf.append(propToGet.sinceVersion);
						xmlBuf.append("\">\n"); //$NON-NLS-1$
						xmlBuf.append("    "); //$NON-NLS-1$
						xmlBuf.append(propToGet.description);
						xmlBuf.append("\n  </Property>"); //$NON-NLS-1$
					}
				}

				while (alphaIter.hasNext()) {
					ConnectionProperty propToGet = (ConnectionProperty) alphaIter
							.next();
					
					xmlBuf.append("\n  <Property name=\""); //$NON-NLS-1$
					xmlBuf.append(propToGet.getPropertyName());
					xmlBuf.append("\" required=\""); //$NON-NLS-1$
					xmlBuf.append(propToGet.required ? "Yes" : "No"); //$NON-NLS-1$ //$NON-NLS-2$

					xmlBuf.append("\" default=\""); //$NON-NLS-1$

					if (propToGet.getDefaultValue() != null) {
						xmlBuf.append(propToGet.getDefaultValue());
					}

					xmlBuf.append("\" sortOrder=\"alpha\" since=\""); //$NON-NLS-1$
					xmlBuf.append(propToGet.sinceVersion);
					xmlBuf.append("\">\n"); //$NON-NLS-1$
					xmlBuf.append("    "); //$NON-NLS-1$
					xmlBuf.append(propToGet.description);
					xmlBuf.append("\n  </Property>"); //$NON-NLS-1$
				}

				xmlBuf.append("\n </PropertyCategory>"); //$NON-NLS-1$
			}
		} catch (IllegalAccessException iae) {
			throw SQLError.createSQLException("Internal properties failure", //$NON-NLS-1$
					SQLError.SQL_STATE_GENERAL_ERROR, getExceptionInterceptor());
		}

		xmlBuf.append("\n</ConnectionProperties>"); //$NON-NLS-1$

		return xmlBuf.toString();
	}

	
	public boolean getAllowLoadLocalInfile() {
		return this.allowLoadLocalInfile.getValueAsBoolean();
	}

	
	public boolean getAllowMultiQueries() {
		return this.allowMultiQueries.getValueAsBoolean();
	}

	
	public boolean getAllowNanAndInf() {
		return allowNanAndInf.getValueAsBoolean();
	}

	
	public boolean getAllowUrlInLocalInfile() {
		return this.allowUrlInLocalInfile.getValueAsBoolean();
	}

	
	public boolean getAlwaysSendSetIsolation() {
		return this.alwaysSendSetIsolation.getValueAsBoolean();
	}

	
	public boolean getAutoDeserialize() {
		return autoDeserialize.getValueAsBoolean();
	}

	
	public boolean getAutoGenerateTestcaseScript() {
		return this.autoGenerateTestcaseScriptAsBoolean;
	}

	
	public boolean getAutoReconnectForPools() {
		return this.autoReconnectForPoolsAsBoolean;
	}

	
	public int getBlobSendChunkSize() {
		return blobSendChunkSize.getValueAsInt();
	}

	
	public boolean getCacheCallableStatements() {
		return this.cacheCallableStatements.getValueAsBoolean();
	}

	
	public boolean getCachePreparedStatements() {
		return ((Boolean) this.cachePreparedStatements.getValueAsObject())
				.booleanValue();
	}

	
	public boolean getCacheResultSetMetadata() {
		return this.cacheResultSetMetaDataAsBoolean;
	}

	
	public boolean getCacheServerConfiguration() {
		return cacheServerConfiguration.getValueAsBoolean();
	}

	
	public int getCallableStatementCacheSize() {
		return this.callableStatementCacheSize.getValueAsInt();
	}

	
	public boolean getCapitalizeTypeNames() {
		return this.capitalizeTypeNames.getValueAsBoolean();
	}

	
	public String getCharacterSetResults() {
		return this.characterSetResults.getValueAsString();
	}

	
	public boolean getClobberStreamingResults() {
		return this.clobberStreamingResults.getValueAsBoolean();
	}

	
	public String getClobCharacterEncoding() {
		return this.clobCharacterEncoding.getValueAsString();
	}

	
	public String getConnectionCollation() {
		return this.connectionCollation.getValueAsString();
	}

	
	public int getConnectTimeout() {
		return this.connectTimeout.getValueAsInt();
	}

	
	public boolean getContinueBatchOnError() {
		return this.continueBatchOnError.getValueAsBoolean();
	}

	
	public boolean getCreateDatabaseIfNotExist() {
		return this.createDatabaseIfNotExist.getValueAsBoolean();
	}

	
	public int getDefaultFetchSize() {
		return this.defaultFetchSize.getValueAsInt();
	}

	
	public boolean getDontTrackOpenResources() {
		return this.dontTrackOpenResources.getValueAsBoolean();
	}

	
	public boolean getDumpQueriesOnException() {
		return this.dumpQueriesOnException.getValueAsBoolean();
	}

	
	public boolean getDynamicCalendars() {
		return this.dynamicCalendars.getValueAsBoolean();
	}

	
	public boolean getElideSetAutoCommits() {
		return this.elideSetAutoCommits.getValueAsBoolean();
	}

	
	public boolean getEmptyStringsConvertToZero() {
		return this.emptyStringsConvertToZero.getValueAsBoolean();
	}

	
	public boolean getEmulateLocators() {
		return this.emulateLocators.getValueAsBoolean();
	}

	
	public boolean getEmulateUnsupportedPstmts() {
		return this.emulateUnsupportedPstmts.getValueAsBoolean();
	}

	
	public boolean getEnablePacketDebug() {
		return this.enablePacketDebug.getValueAsBoolean();
	}

	
	public String getEncoding() {
		return this.characterEncodingAsString;
	}

	
	public boolean getExplainSlowQueries() {
		return this.explainSlowQueries.getValueAsBoolean();
	}

	
	public boolean getFailOverReadOnly() {
		return this.failOverReadOnly.getValueAsBoolean();
	}

	
	public boolean getGatherPerformanceMetrics() {
		return this.gatherPerformanceMetrics.getValueAsBoolean();
	}

	/**
	 * DOCUMENT ME!
	 * 
	 * @return
	 */
	protected boolean getHighAvailability() {
		return this.highAvailabilityAsBoolean;
	}

	
	public boolean getHoldResultsOpenOverStatementClose() {
		return holdResultsOpenOverStatementClose.getValueAsBoolean();
	}

	
	public boolean getIgnoreNonTxTables() {
		return this.ignoreNonTxTables.getValueAsBoolean();
	}

	
	public int getInitialTimeout() {
		return this.initialTimeout.getValueAsInt();
	}

	
	public boolean getInteractiveClient() {
		return this.isInteractiveClient.getValueAsBoolean();
	}

	
	public boolean getIsInteractiveClient() {
		return this.isInteractiveClient.getValueAsBoolean();
	}

	
	public boolean getJdbcCompliantTruncation() {
		return this.jdbcCompliantTruncation.getValueAsBoolean();
	}

	
	public int getLocatorFetchBufferSize() {
		return this.locatorFetchBufferSize.getValueAsInt();
	}

	
	public String getLogger() {
		return this.loggerClassName.getValueAsString();
	}

	
	public String getLoggerClassName() {
		return this.loggerClassName.getValueAsString();
	}

	
	public boolean getLogSlowQueries() {
		return this.logSlowQueries.getValueAsBoolean();
	}

	
	public boolean getMaintainTimeStats() {
		return maintainTimeStatsAsBoolean;
	}

	
	public int getMaxQuerySizeToLog() {
		return this.maxQuerySizeToLog.getValueAsInt();
	}

	
	public int getMaxReconnects() {
		return this.maxReconnects.getValueAsInt();
	}

	
	public int getMaxRows() {
		return this.maxRowsAsInt;
	}

	
	public int getMetadataCacheSize() {
		return this.metadataCacheSize.getValueAsInt();
	}

	
	public boolean getNoDatetimeStringSync() {
		return this.noDatetimeStringSync.getValueAsBoolean();
	}

	
	public boolean getNullCatalogMeansCurrent() {
		return this.nullCatalogMeansCurrent.getValueAsBoolean();
	}

	
	public boolean getNullNamePatternMatchesAll() {
		return this.nullNamePatternMatchesAll.getValueAsBoolean();
	}

	
	public int getPacketDebugBufferSize() {
		return this.packetDebugBufferSize.getValueAsInt();
	}

	
	public boolean getParanoid() {
		return this.paranoid.getValueAsBoolean();
	}

	
	public boolean getPedantic() {
		return this.pedantic.getValueAsBoolean();
	}

	
	public int getPreparedStatementCacheSize() {
		return ((Integer) this.preparedStatementCacheSize.getValueAsObject())
				.intValue();
	}

	
	public int getPreparedStatementCacheSqlLimit() {
		return ((Integer) this.preparedStatementCacheSqlLimit
				.getValueAsObject()).intValue();
	}

	
	public boolean getProfileSql() {
		return this.profileSQLAsBoolean;
	}

	
	public boolean getProfileSQL() {
		return this.profileSQL.getValueAsBoolean();
	}

	
	public String getPropertiesTransform() {
		return this.propertiesTransform.getValueAsString();
	}

	
	public int getQueriesBeforeRetryMaster() {
		return this.queriesBeforeRetryMaster.getValueAsInt();
	}

	
	public boolean getReconnectAtTxEnd() {
		return this.reconnectTxAtEndAsBoolean;
	}

	
	public boolean getRelaxAutoCommit() {
		return this.relaxAutoCommit.getValueAsBoolean();
	}

	
	public int getReportMetricsIntervalMillis() {
		return this.reportMetricsIntervalMillis.getValueAsInt();
	}

	
	public boolean getRequireSSL() {
		return this.requireSSL.getValueAsBoolean();
	}

	protected boolean getRetainStatementAfterResultSetClose() {
		return this.retainStatementAfterResultSetClose.getValueAsBoolean();
	}

	
	public boolean getRollbackOnPooledClose() {
		return this.rollbackOnPooledClose.getValueAsBoolean();
	}

	
	public boolean getRoundRobinLoadBalance() {
		return this.roundRobinLoadBalance.getValueAsBoolean();
	}

	
	public boolean getRunningCTS13() {
		return this.runningCTS13.getValueAsBoolean();
	}

	
	public int getSecondsBeforeRetryMaster() {
		return this.secondsBeforeRetryMaster.getValueAsInt();
	}

	
	public String getServerTimezone() {
		return this.serverTimezone.getValueAsString();
	}

	
	public String getSessionVariables() {
		return sessionVariables.getValueAsString();
	}

	
	public int getSlowQueryThresholdMillis() {
		return this.slowQueryThresholdMillis.getValueAsInt();
	}

	
	public String getSocketFactoryClassName() {
		return this.socketFactoryClassName.getValueAsString();
	}

	
	public int getSocketTimeout() {
		return this.socketTimeout.getValueAsInt();
	}

	
	public boolean getStrictFloatingPoint() {
		return this.strictFloatingPoint.getValueAsBoolean();
	}

	
	public boolean getStrictUpdates() {
		return this.strictUpdates.getValueAsBoolean();
	}

	
	public boolean getTinyInt1isBit() {
		return this.tinyInt1isBit.getValueAsBoolean();
	}

	
	public boolean getTraceProtocol() {
		return this.traceProtocol.getValueAsBoolean();
	}

	
	public boolean getTransformedBitIsBoolean() {
		return this.transformedBitIsBoolean.getValueAsBoolean();
	}

	
	public boolean getUseCompression() {
		return this.useCompression.getValueAsBoolean();
	}

	
	public boolean getUseFastIntParsing() {
		return this.useFastIntParsing.getValueAsBoolean();
	}

	
	public boolean getUseHostsInPrivileges() {
		return this.useHostsInPrivileges.getValueAsBoolean();
	}

	
	public boolean getUseInformationSchema() {
		return this.useInformationSchema.getValueAsBoolean();
	}

	
	public boolean getUseLocalSessionState() {
		return this.useLocalSessionState.getValueAsBoolean();
	}

	
	public boolean getUseOldUTF8Behavior() {
		return this.useOldUTF8BehaviorAsBoolean;
	}

	
	public boolean getUseOnlyServerErrorMessages() {
		return this.useOnlyServerErrorMessages.getValueAsBoolean();
	}

	
	public boolean getUseReadAheadInput() {
		return this.useReadAheadInput.getValueAsBoolean();
	}

	
	public boolean getUseServerPreparedStmts() {
		return this.detectServerPreparedStmts.getValueAsBoolean();
	}

	
	public boolean getUseSqlStateCodes() {
		return this.useSqlStateCodes.getValueAsBoolean();
	}

	
	public boolean getUseSSL() {
		return this.useSSL.getValueAsBoolean();
	}

	
	public boolean getUseStreamLengthsInPrepStmts() {
		return this.useStreamLengthsInPrepStmts.getValueAsBoolean();
	}

	
	public boolean getUseTimezone() {
		return this.useTimezone.getValueAsBoolean();
	}

	
	public boolean getUseUltraDevWorkAround() {
		return this.useUltraDevWorkAround.getValueAsBoolean();
	}

	
	public boolean getUseUnbufferedInput() {
		return this.useUnbufferedInput.getValueAsBoolean();
	}

	
	public boolean getUseUnicode() {
		return this.useUnicodeAsBoolean;
	}

	
	public boolean getUseUsageAdvisor() {
		return this.useUsageAdvisorAsBoolean;
	}

	
	public boolean getYearIsDateType() {
		return this.yearIsDateType.getValueAsBoolean();
	}

	
	public String getZeroDateTimeBehavior() {
		return this.zeroDateTimeBehavior.getValueAsString();
	}

	/**
	 * Initializes driver properties that come from a JNDI reference (in the
	 * case of a javax.sql.DataSource bound into some name service that doesn't
	 * handle Java objects directly).
	 * 
	 * @param ref
	 *            The JNDI Reference that holds RefAddrs for all properties
	 * @throws SQLException
	 *             DOCUMENT ME!
	 */
	protected void initializeFromRef(Reference ref) throws SQLException {
		int numPropertiesToSet = PROPERTY_LIST.size();

		for (int i = 0; i < numPropertiesToSet; i++) {
			java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
					.get(i);

			try {
				ConnectionProperty propToSet = (ConnectionProperty) propertyField
						.get(this);

				if (ref != null) {
					propToSet.initializeFrom(ref);
				}
			} catch (IllegalAccessException iae) {
				throw SQLError.createSQLException("Internal properties failure", //$NON-NLS-1$
						SQLError.SQL_STATE_GENERAL_ERROR, getExceptionInterceptor());
			}
		}

		postInitialization();
	}

	/**
	 * Initializes driver properties that come from URL or properties passed to
	 * the driver manager.
	 * 
	 * @param info
	 *            DOCUMENT ME!
	 * @throws SQLException
	 *             DOCUMENT ME!
	 */
	protected void initializeProperties(Properties info) throws SQLException {
		if (info != null) {
			// For backwards-compatibility
			String profileSqlLc = info.getProperty("profileSql"); //$NON-NLS-1$

			if (profileSqlLc != null) {
				info.put("profileSQL", profileSqlLc); //$NON-NLS-1$
			}

			Properties infoCopy = (Properties) info.clone();

			infoCopy.remove(NonRegisteringDriver.HOST_PROPERTY_KEY);
			infoCopy.remove(NonRegisteringDriver.USER_PROPERTY_KEY);
			infoCopy.remove(NonRegisteringDriver.PASSWORD_PROPERTY_KEY);
			infoCopy.remove(NonRegisteringDriver.DBNAME_PROPERTY_KEY);
			infoCopy.remove(NonRegisteringDriver.PORT_PROPERTY_KEY);
			infoCopy.remove("profileSql"); //$NON-NLS-1$

			int numPropertiesToSet = PROPERTY_LIST.size();

			for (int i = 0; i < numPropertiesToSet; i++) {
				java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
						.get(i);

				try {
					ConnectionProperty propToSet = (ConnectionProperty) propertyField
							.get(this);

					propToSet.initializeFrom(infoCopy);
				} catch (IllegalAccessException iae) {
					throw SQLError.createSQLException(
							Messages.getString("ConnectionProperties.unableToInitDriverProperties") //$NON-NLS-1$
									+ iae.toString(),
							SQLError.SQL_STATE_GENERAL_ERROR, getExceptionInterceptor());
				}
			}

			postInitialization();
		}
	}

	protected void postInitialization() throws SQLException {
	
		// Support 'old' profileSql capitalization
		if (this.profileSql.getValueAsObject() != null) {
			this.profileSQL.initializeFrom(this.profileSql.getValueAsObject()
					.toString());
		}

		this.reconnectTxAtEndAsBoolean = ((Boolean) this.reconnectAtTxEnd
				.getValueAsObject()).booleanValue();

		// Adjust max rows
		if (this.getMaxRows() == 0) {
			// adjust so that it will become MysqlDefs.MAX_ROWS
			// in execSQL()
			this.maxRows.setValueAsObject(Constants.integerValueOf(-1));
		}

		//
		// Check character encoding
		//
		String testEncoding = this.getEncoding();

		if (testEncoding != null) {
			// Attempt to use the encoding, and bail out if it
			// can't be used
			try {
				String testString = "abc"; //$NON-NLS-1$
				testString.getBytes(testEncoding);
			} catch (UnsupportedEncodingException UE) {
				throw SQLError.createSQLException(Messages.getString(
						"ConnectionProperties.unsupportedCharacterEncoding", 
						new Object[] {testEncoding}), "0S100", getExceptionInterceptor()); //$NON-NLS-1$ //$NON-NLS-2$
			}
		}

		// Metadata caching is only supported on JDK-1.4 and newer
		// because it relies on LinkedHashMap being present.
		// Check (and disable) if not supported
		if (((Boolean) this.cacheResultSetMetadata.getValueAsObject())
				.booleanValue()) {
			try {
				Class.forName("java.util.LinkedHashMap"); //$NON-NLS-1$
			} catch (ClassNotFoundException cnfe) {
				this.cacheResultSetMetadata.setValue(false);
			}
		}

		this.cacheResultSetMetaDataAsBoolean = this.cacheResultSetMetadata
				.getValueAsBoolean();
		this.useUnicodeAsBoolean = this.useUnicode.getValueAsBoolean();
		this.characterEncodingAsString = ((String) this.characterEncoding
				.getValueAsObject());
		this.highAvailabilityAsBoolean = this.autoReconnect.getValueAsBoolean();
		this.autoReconnectForPoolsAsBoolean = this.autoReconnectForPools
				.getValueAsBoolean();
		this.maxRowsAsInt = ((Integer) this.maxRows.getValueAsObject())
				.intValue();
		this.profileSQLAsBoolean = this.profileSQL.getValueAsBoolean();
		this.useUsageAdvisorAsBoolean = this.useUsageAdvisor
				.getValueAsBoolean();
		this.useOldUTF8BehaviorAsBoolean = this.useOldUTF8Behavior
				.getValueAsBoolean();
		this.autoGenerateTestcaseScriptAsBoolean = this.autoGenerateTestcaseScript
				.getValueAsBoolean();
		this.maintainTimeStatsAsBoolean = this.maintainTimeStats
				.getValueAsBoolean();
		this.jdbcCompliantTruncationForReads = getJdbcCompliantTruncation();
		
		if (getUseCursorFetch()) {
			// assume they want to use server-side prepared statements
			// because they're required for this functionality
			setDetectServerPreparedStmts(true);
		}
	}

	
	public void setAllowLoadLocalInfile(boolean property) {
		this.allowLoadLocalInfile.setValue(property);
	}

	
	public void setAllowMultiQueries(boolean property) {
		this.allowMultiQueries.setValue(property);
	}

	
	public void setAllowNanAndInf(boolean flag) {
		this.allowNanAndInf.setValue(flag);
	}

	
	public void setAllowUrlInLocalInfile(boolean flag) {
		this.allowUrlInLocalInfile.setValue(flag);
	}

	
	public void setAlwaysSendSetIsolation(boolean flag) {
		this.alwaysSendSetIsolation.setValue(flag);
	}

	
	public void setAutoDeserialize(boolean flag) {
		this.autoDeserialize.setValue(flag);
	}

	
	public void setAutoGenerateTestcaseScript(boolean flag) {
		this.autoGenerateTestcaseScript.setValue(flag);
		this.autoGenerateTestcaseScriptAsBoolean = this.autoGenerateTestcaseScript
				.getValueAsBoolean();
	}

	
	public void setAutoReconnect(boolean flag) {
		this.autoReconnect.setValue(flag);
	}

	
	public void setAutoReconnectForConnectionPools(boolean property) {
		this.autoReconnectForPools.setValue(property);
		this.autoReconnectForPoolsAsBoolean = this.autoReconnectForPools
				.getValueAsBoolean();
	}

	
	public void setAutoReconnectForPools(boolean flag) {
		this.autoReconnectForPools.setValue(flag);
	}

	
	public void setBlobSendChunkSize(String value) throws SQLException {
		this.blobSendChunkSize.setValue(value);
	}

	
	public void setCacheCallableStatements(boolean flag) {
		this.cacheCallableStatements.setValue(flag);
	}

	
	public void setCachePreparedStatements(boolean flag) {
		this.cachePreparedStatements.setValue(flag);
	}

	
	public void setCacheResultSetMetadata(boolean property) {
		this.cacheResultSetMetadata.setValue(property);
		this.cacheResultSetMetaDataAsBoolean = this.cacheResultSetMetadata
				.getValueAsBoolean();
	}

	
	public void setCacheServerConfiguration(boolean flag) {
		this.cacheServerConfiguration.setValue(flag);
	}

	
	public void setCallableStatementCacheSize(int size) {
		this.callableStatementCacheSize.setValue(size);
	}

	
	public void setCapitalizeDBMDTypes(boolean property) {
		this.capitalizeTypeNames.setValue(property);
	}

	
	public void setCapitalizeTypeNames(boolean flag) {
		this.capitalizeTypeNames.setValue(flag);
	}

	
	public void setCharacterEncoding(String encoding) {
		this.characterEncoding.setValue(encoding);
	}

	
	public void setCharacterSetResults(String characterSet) {
		this.characterSetResults.setValue(characterSet);
	}

	
	public void setClobberStreamingResults(boolean flag) {
		this.clobberStreamingResults.setValue(flag);
	}

	
	public void setClobCharacterEncoding(String encoding) {
		this.clobCharacterEncoding.setValue(encoding);
	}

	
	public void setConnectionCollation(String collation) {
		this.connectionCollation.setValue(collation);
	}

	
	public void setConnectTimeout(int timeoutMs) {
		this.connectTimeout.setValue(timeoutMs);
	}

	
	public void setContinueBatchOnError(boolean property) {
		this.continueBatchOnError.setValue(property);
	}

	
	public void setCreateDatabaseIfNotExist(boolean flag) {
		this.createDatabaseIfNotExist.setValue(flag);
	}

	
	public void setDefaultFetchSize(int n) {
		this.defaultFetchSize.setValue(n);
	}

	
	public void setDetectServerPreparedStmts(boolean property) {
		this.detectServerPreparedStmts.setValue(property);
	}

	
	public void setDontTrackOpenResources(boolean flag) {
		this.dontTrackOpenResources.setValue(flag);
	}

	
	public void setDumpQueriesOnException(boolean flag) {
		this.dumpQueriesOnException.setValue(flag);
	}

	
	public void setDynamicCalendars(boolean flag) {
		this.dynamicCalendars.setValue(flag);
	}

	
	public void setElideSetAutoCommits(boolean flag) {
		this.elideSetAutoCommits.setValue(flag);
	}

	
	public void setEmptyStringsConvertToZero(boolean flag) {
		this.emptyStringsConvertToZero.setValue(flag);
	}

	
	public void setEmulateLocators(boolean property) {
		this.emulateLocators.setValue(property);
	}

	
	public void setEmulateUnsupportedPstmts(boolean flag) {
		this.emulateUnsupportedPstmts.setValue(flag);
	}

	
	public void setEnablePacketDebug(boolean flag) {
		this.enablePacketDebug.setValue(flag);
	}

	
	public void setEncoding(String property) {
		this.characterEncoding.setValue(property);
		this.characterEncodingAsString = this.characterEncoding
				.getValueAsString();
	}

	
	public void setExplainSlowQueries(boolean flag) {
		this.explainSlowQueries.setValue(flag);
	}

	
	public void setFailOverReadOnly(boolean flag) {
		this.failOverReadOnly.setValue(flag);
	}

	
	public void setGatherPerformanceMetrics(boolean flag) {
		this.gatherPerformanceMetrics.setValue(flag);
	}

	/**
	 * DOCUMENT ME!
	 * 
	 * @param property
	 */
	protected void setHighAvailability(boolean property) {
		this.autoReconnect.setValue(property);
		this.highAvailabilityAsBoolean = this.autoReconnect.getValueAsBoolean();
	}

	
	public void setHoldResultsOpenOverStatementClose(boolean flag) {
		this.holdResultsOpenOverStatementClose.setValue(flag);
	}

	
	public void setIgnoreNonTxTables(boolean property) {
		this.ignoreNonTxTables.setValue(property);
	}

	
	public void setInitialTimeout(int property) {
		this.initialTimeout.setValue(property);
	}

	
	public void setIsInteractiveClient(boolean property) {
		this.isInteractiveClient.setValue(property);
	}

	
	public void setJdbcCompliantTruncation(boolean flag) {
		this.jdbcCompliantTruncation.setValue(flag);
	}

	
	public void setLocatorFetchBufferSize(String value) throws SQLException {
		this.locatorFetchBufferSize.setValue(value);
	}

	
	public void setLogger(String property) {
		this.loggerClassName.setValueAsObject(property);
	}

	
	public void setLoggerClassName(String className) {
		this.loggerClassName.setValue(className);
	}

	
	public void setLogSlowQueries(boolean flag) {
		this.logSlowQueries.setValue(flag);
	}

	
	public void setMaintainTimeStats(boolean flag) {
		this.maintainTimeStats.setValue(flag);
		this.maintainTimeStatsAsBoolean = this.maintainTimeStats
				.getValueAsBoolean();
	}

	
	public void setMaxQuerySizeToLog(int sizeInBytes) {
		this.maxQuerySizeToLog.setValue(sizeInBytes);
	}

	
	public void setMaxReconnects(int property) {
		this.maxReconnects.setValue(property);
	}

	
	public void setMaxRows(int property) {
		this.maxRows.setValue(property);
		this.maxRowsAsInt = this.maxRows.getValueAsInt();
	}

	
	public void setMetadataCacheSize(int value) {
		this.metadataCacheSize.setValue(value);
	}

	
	public void setNoDatetimeStringSync(boolean flag) {
		this.noDatetimeStringSync.setValue(flag);
	}

	
	public void setNullCatalogMeansCurrent(boolean value) {
		this.nullCatalogMeansCurrent.setValue(value);
	}

	
	public void setNullNamePatternMatchesAll(boolean value) {
		this.nullNamePatternMatchesAll.setValue(value);
	}

	
	public void setPacketDebugBufferSize(int size) {
		this.packetDebugBufferSize.setValue(size);
	}

	
	public void setParanoid(boolean property) {
		this.paranoid.setValue(property);
	}

	
	public void setPedantic(boolean property) {
		this.pedantic.setValue(property);
	}

	
	public void setPreparedStatementCacheSize(int cacheSize) {
		this.preparedStatementCacheSize.setValue(cacheSize);
	}

	
	public void setPreparedStatementCacheSqlLimit(int cacheSqlLimit) {
		this.preparedStatementCacheSqlLimit.setValue(cacheSqlLimit);
	}

	
	public void setProfileSql(boolean property) {
		this.profileSQL.setValue(property);
		this.profileSQLAsBoolean = this.profileSQL.getValueAsBoolean();
	}

	
	public void setProfileSQL(boolean flag) {
		this.profileSQL.setValue(flag);
	}

	
	public void setPropertiesTransform(String value) {
		this.propertiesTransform.setValue(value);
	}

	
	public void setQueriesBeforeRetryMaster(int property) {
		this.queriesBeforeRetryMaster.setValue(property);
	}

	
	public void setReconnectAtTxEnd(boolean property) {
		this.reconnectAtTxEnd.setValue(property);
		this.reconnectTxAtEndAsBoolean = this.reconnectAtTxEnd
				.getValueAsBoolean();
	}

	
	public void setRelaxAutoCommit(boolean property) {
		this.relaxAutoCommit.setValue(property);
	}

	
	public void setReportMetricsIntervalMillis(int millis) {
		this.reportMetricsIntervalMillis.setValue(millis);
	}

	
	public void setRequireSSL(boolean property) {
		this.requireSSL.setValue(property);
	}

	
	public void setRetainStatementAfterResultSetClose(boolean flag) {
		this.retainStatementAfterResultSetClose.setValue(flag);
	}

	
	public void setRollbackOnPooledClose(boolean flag) {
		this.rollbackOnPooledClose.setValue(flag);
	}

	
	public void setRoundRobinLoadBalance(boolean flag) {
		this.roundRobinLoadBalance.setValue(flag);
	}

	
	public void setRunningCTS13(boolean flag) {
		this.runningCTS13.setValue(flag);
	}

	
	public void setSecondsBeforeRetryMaster(int property) {
		this.secondsBeforeRetryMaster.setValue(property);
	}

	
	public void setServerTimezone(String property) {
		this.serverTimezone.setValue(property);
	}

	
	public void setSessionVariables(String variables) {
		this.sessionVariables.setValue(variables);
	}

	
	public void setSlowQueryThresholdMillis(int millis) {
		this.slowQueryThresholdMillis.setValue(millis);
	}

	
	public void setSocketFactoryClassName(String property) {
		this.socketFactoryClassName.setValue(property);
	}

	
	public void setSocketTimeout(int property) {
		this.socketTimeout.setValue(property);
	}

	
	public void setStrictFloatingPoint(boolean property) {
		this.strictFloatingPoint.setValue(property);
	}

	
	public void setStrictUpdates(boolean property) {
		this.strictUpdates.setValue(property);
	}

	
	public void setTinyInt1isBit(boolean flag) {
		this.tinyInt1isBit.setValue(flag);
	}

	
	public void setTraceProtocol(boolean flag) {
		this.traceProtocol.setValue(flag);
	}

	
	public void setTransformedBitIsBoolean(boolean flag) {
		this.transformedBitIsBoolean.setValue(flag);
	}

	
	public void setUseCompression(boolean property) {
		this.useCompression.setValue(property);
	}

	
	public void setUseFastIntParsing(boolean flag) {
		this.useFastIntParsing.setValue(flag);
	}

	
	public void setUseHostsInPrivileges(boolean property) {
		this.useHostsInPrivileges.setValue(property);
	}

	
	public void setUseInformationSchema(boolean flag) {
		this.useInformationSchema.setValue(flag);
	}

	
	public void setUseLocalSessionState(boolean flag) {
		this.useLocalSessionState.setValue(flag);
	}

	
	public void setUseOldUTF8Behavior(boolean flag) {
		this.useOldUTF8Behavior.setValue(flag);
		this.useOldUTF8BehaviorAsBoolean = this.useOldUTF8Behavior
				.getValueAsBoolean();
	}

	
	public void setUseOnlyServerErrorMessages(boolean flag) {
		this.useOnlyServerErrorMessages.setValue(flag);
	}

	
	public void setUseReadAheadInput(boolean flag) {
		this.useReadAheadInput.setValue(flag);
	}

	
	public void setUseServerPreparedStmts(boolean flag) {
		this.detectServerPreparedStmts.setValue(flag);
	}

	
	public void setUseSqlStateCodes(boolean flag) {
		this.useSqlStateCodes.setValue(flag);
	}

	
	public void setUseSSL(boolean property) {
		this.useSSL.setValue(property);
	}

	
	public void setUseStreamLengthsInPrepStmts(boolean property) {
		this.useStreamLengthsInPrepStmts.setValue(property);
	}

	
	public void setUseTimezone(boolean property) {
		this.useTimezone.setValue(property);
	}

	
	public void setUseUltraDevWorkAround(boolean property) {
		this.useUltraDevWorkAround.setValue(property);
	}

	
	public void setUseUnbufferedInput(boolean flag) {
		this.useUnbufferedInput.setValue(flag);
	}

	
	public void setUseUnicode(boolean flag) {
		this.useUnicode.setValue(flag);
		this.useUnicodeAsBoolean = this.useUnicode.getValueAsBoolean();
	}

	
	public void setUseUsageAdvisor(boolean useUsageAdvisorFlag) {
		this.useUsageAdvisor.setValue(useUsageAdvisorFlag);
		this.useUsageAdvisorAsBoolean = this.useUsageAdvisor
				.getValueAsBoolean();
	}

	
	public void setYearIsDateType(boolean flag) {
		this.yearIsDateType.setValue(flag);
	}

	
	public void setZeroDateTimeBehavior(String behavior) {
		this.zeroDateTimeBehavior.setValue(behavior);
	}

	protected void storeToRef(Reference ref) throws SQLException {
		int numPropertiesToSet = PROPERTY_LIST.size();

		for (int i = 0; i < numPropertiesToSet; i++) {
			java.lang.reflect.Field propertyField = (java.lang.reflect.Field) PROPERTY_LIST
					.get(i);

			try {
				ConnectionProperty propToStore = (ConnectionProperty) propertyField
						.get(this);

				if (ref != null) {
					propToStore.storeTo(ref);
				}
			} catch (IllegalAccessException iae) {
				throw SQLError.createSQLException(Messages.getString("ConnectionProperties.errorNotExpected"), getExceptionInterceptor()); //$NON-NLS-1$
			}
		}
	}

	
	public boolean useUnbufferedInput() {
		return this.useUnbufferedInput.getValueAsBoolean();
	}

	
	public boolean getUseCursorFetch() {
		return this.useCursorFetch.getValueAsBoolean();
	}

	
	public void setUseCursorFetch(boolean flag) {
		this.useCursorFetch.setValue(flag);
	}

	
	public boolean getOverrideSupportsIntegrityEnhancementFacility() {
		return this.overrideSupportsIntegrityEnhancementFacility.getValueAsBoolean();
	}

	
	public void setOverrideSupportsIntegrityEnhancementFacility(boolean flag) {
		this.overrideSupportsIntegrityEnhancementFacility.setValue(flag);	
	}
	
	
	public boolean getNoTimezoneConversionForTimeType() {
		return this.noTimezoneConversionForTimeType.getValueAsBoolean();
	}

	
	public void setNoTimezoneConversionForTimeType(boolean flag) {
		this.noTimezoneConversionForTimeType.setValue(flag);
	}

	
	public boolean getUseJDBCCompliantTimezoneShift() {
		return this.useJDBCCompliantTimezoneShift.getValueAsBoolean();
	}

	
	public void setUseJDBCCompliantTimezoneShift(boolean flag) {
		this.useJDBCCompliantTimezoneShift.setValue(flag);
	}
	
	
	public boolean getAutoClosePStmtStreams() {
		return this.autoClosePStmtStreams.getValueAsBoolean();
	}

	
	public void setAutoClosePStmtStreams(boolean flag) {
		this.autoClosePStmtStreams.setValue(flag);
	}

	
	public boolean getProcessEscapeCodesForPrepStmts() {
		return this.processEscapeCodesForPrepStmts.getValueAsBoolean();
	}

	
	public void setProcessEscapeCodesForPrepStmts(boolean flag) {
		this.processEscapeCodesForPrepStmts.setValue(flag);
	}

	
	public boolean getUseGmtMillisForDatetimes() {
		return this.useGmtMillisForDatetimes.getValueAsBoolean();
	}

	
	public void setUseGmtMillisForDatetimes(boolean flag) {
		this.useGmtMillisForDatetimes.setValue(flag);
	}
	
	
	public boolean getDumpMetadataOnColumnNotFound() {
		return this.dumpMetadataOnColumnNotFound.getValueAsBoolean();
	}

	
	public void setDumpMetadataOnColumnNotFound(boolean flag) {
		this.dumpMetadataOnColumnNotFound.setValue(flag);
	}

	
	public String getResourceId() {
		return this.resourceId.getValueAsString();
	}

	
	public void setResourceId(String resourceId) {
		this.resourceId.setValue(resourceId);
	}
	
	
	public boolean getRewriteBatchedStatements() {
		return this.rewriteBatchedStatements.getValueAsBoolean();
	}

	
	public void setRewriteBatchedStatements(boolean flag) {
		this.rewriteBatchedStatements.setValue(flag);
	}
	
	
	public boolean getJdbcCompliantTruncationForReads() {
		return this.jdbcCompliantTruncationForReads;
	}

	
	public void setJdbcCompliantTruncationForReads(
			boolean jdbcCompliantTruncationForReads) {
		this.jdbcCompliantTruncationForReads = jdbcCompliantTruncationForReads;
	}

	
	public boolean getUseJvmCharsetConverters() {
		return this.useJvmCharsetConverters.getValueAsBoolean();
	}

	
	public void setUseJvmCharsetConverters(boolean flag) {
		this.useJvmCharsetConverters.setValue(flag);
	}

	
	public boolean getPinGlobalTxToPhysicalConnection() {
		return this.pinGlobalTxToPhysicalConnection.getValueAsBoolean();
	}

	
	public void setPinGlobalTxToPhysicalConnection(boolean flag) {
		this.pinGlobalTxToPhysicalConnection.setValue(flag);
	}
	
	/*
	 * "Aliases" which match the property names to make using 
	 * from datasources easier.
	 */
	
	
	public void setGatherPerfMetrics(boolean flag) {
		setGatherPerformanceMetrics(flag);
	}
	
	
	public boolean getGatherPerfMetrics() {
		return getGatherPerformanceMetrics();
	}
	
	
	public void setUltraDevHack(boolean flag) {
		setUseUltraDevWorkAround(flag);
	}
	
	
	public boolean getUltraDevHack() {
		return getUseUltraDevWorkAround();
	}
	
	
	public void setInteractiveClient(boolean property) {
		setIsInteractiveClient(property);
	}
	
	
	public void setSocketFactory(String name) {
		setSocketFactoryClassName(name);
	}
	
	
	public String getSocketFactory() {
		return getSocketFactoryClassName();
	}
	
	
	public void setUseServerPrepStmts(boolean flag) {
		setUseServerPreparedStmts(flag);
	}

	
	public boolean getUseServerPrepStmts() {
		return getUseServerPreparedStmts();
	}

	
	public void setCacheCallableStmts(boolean flag) {
		setCacheCallableStatements(flag);
	}

	
	public boolean getCacheCallableStmts() {
		return getCacheCallableStatements();
	}

	
	public void setCachePrepStmts(boolean flag) {
		setCachePreparedStatements(flag);
	}

	
	public boolean getCachePrepStmts() {
		return getCachePreparedStatements();
	}

	
	public void setCallableStmtCacheSize(int cacheSize) {
		setCallableStatementCacheSize(cacheSize);
	}

	
	public int getCallableStmtCacheSize() {
		return getCallableStatementCacheSize();
	}

	
	public void setPrepStmtCacheSize(int cacheSize) {
		setPreparedStatementCacheSize(cacheSize);
	}

	
	public int getPrepStmtCacheSize() {
		return getPreparedStatementCacheSize();
	}

	
	public void setPrepStmtCacheSqlLimit(int sqlLimit) {
		setPreparedStatementCacheSqlLimit(sqlLimit);
	}

	
	public int getPrepStmtCacheSqlLimit() {
		return getPreparedStatementCacheSqlLimit();
	}

	
	public boolean getNoAccessToProcedureBodies() {
		return this.noAccessToProcedureBodies.getValueAsBoolean();
	}

	
	public void setNoAccessToProcedureBodies(boolean flag) {
		this.noAccessToProcedureBodies.setValue(flag);
	}

	
	public boolean getUseOldAliasMetadataBehavior() {
		return this.useOldAliasMetadataBehavior.getValueAsBoolean();
	}

	
	public void setUseOldAliasMetadataBehavior(boolean flag) {
		this.useOldAliasMetadataBehavior.setValue(flag);
	}

	
	public String getClientCertificateKeyStorePassword() {
		return clientCertificateKeyStorePassword.getValueAsString();
	}

	
	public void setClientCertificateKeyStorePassword(
			String value) {
		this.clientCertificateKeyStorePassword.setValue(value);
	}

	
	public String getClientCertificateKeyStoreType() {
		return clientCertificateKeyStoreType.getValueAsString();
	}

	
	public void setClientCertificateKeyStoreType(
			String value) {
		this.clientCertificateKeyStoreType.setValue(value);
	}

	
	public String getClientCertificateKeyStoreUrl() {
		return clientCertificateKeyStoreUrl.getValueAsString();
	}

	
	public void setClientCertificateKeyStoreUrl(
			String value) {
		this.clientCertificateKeyStoreUrl.setValue(value);
	}

	
	public String getTrustCertificateKeyStorePassword() {
		return trustCertificateKeyStorePassword.getValueAsString();
	}

	
	public void setTrustCertificateKeyStorePassword(
			String value) {
		this.trustCertificateKeyStorePassword.setValue(value);
	}

	
	public String getTrustCertificateKeyStoreType() {
		return trustCertificateKeyStoreType.getValueAsString();
	}

	
	public void setTrustCertificateKeyStoreType(
			String value) {
		this.trustCertificateKeyStoreType.setValue(value);
	}

	
	public String getTrustCertificateKeyStoreUrl() {
		return trustCertificateKeyStoreUrl.getValueAsString();
	}

	
	public void setTrustCertificateKeyStoreUrl(
			String value) {
		this.trustCertificateKeyStoreUrl.setValue(value);
	}
	
	
	public boolean getUseSSPSCompatibleTimezoneShift() {
		return this.useSSPSCompatibleTimezoneShift.getValueAsBoolean();
	}

	
	public void setUseSSPSCompatibleTimezoneShift(boolean flag) {
		this.useSSPSCompatibleTimezoneShift.setValue(flag);
	}
	
	
	public boolean getTreatUtilDateAsTimestamp() {
		return this.treatUtilDateAsTimestamp.getValueAsBoolean();
	}

	
	public void setTreatUtilDateAsTimestamp(boolean flag) {
		this.treatUtilDateAsTimestamp.setValue(flag);
	}

	
	public boolean getUseFastDateParsing() {
		return this.useFastDateParsing.getValueAsBoolean();
	}

	
	public void setUseFastDateParsing(boolean flag) {
		this.useFastDateParsing.setValue(flag);
	}
	
	
	public String getLocalSocketAddress() {
		return this.localSocketAddress.getValueAsString();
	}

	
	public void setLocalSocketAddress(String address) {
		this.localSocketAddress.setValue(address);
	}
	
	
	public void setUseConfigs(String configs) {
		this.useConfigs.setValue(configs);
	}
	
	
	public String getUseConfigs() {
		return this.useConfigs.getValueAsString();
	}
	
	
	
	public boolean getGenerateSimpleParameterMetadata() {
		return this.generateSimpleParameterMetadata.getValueAsBoolean();
	}
	
	
	public void setGenerateSimpleParameterMetadata(boolean flag) {
		this.generateSimpleParameterMetadata.setValue(flag);
	}	

	
	public boolean getLogXaCommands() {
		return this.logXaCommands.getValueAsBoolean();
	}

	
	public void setLogXaCommands(boolean flag) {
		this.logXaCommands.setValue(flag);
	}

	
	public int getResultSetSizeThreshold() {
		return this.resultSetSizeThreshold.getValueAsInt();
	}

	
	public void setResultSetSizeThreshold(int threshold) {
		this.resultSetSizeThreshold.setValue(threshold);
	}

	
	public int getNetTimeoutForStreamingResults() {
		return this.netTimeoutForStreamingResults.getValueAsInt();
	}

	
	public void setNetTimeoutForStreamingResults(int value) {
		this.netTimeoutForStreamingResults.setValue(value);
	}
	
	
	public boolean getEnableQueryTimeouts() {
		return this.enableQueryTimeouts.getValueAsBoolean();
	}

	
	public void setEnableQueryTimeouts(boolean flag) {
		this.enableQueryTimeouts.setValue(flag);
	}

	
	public boolean getPadCharsWithSpace() {
		return this.padCharsWithSpace.getValueAsBoolean();
	}

	
	public void setPadCharsWithSpace(boolean flag) {
		this.padCharsWithSpace.setValue(flag);
	}

	
	public boolean getUseDynamicCharsetInfo() {
		return this.useDynamicCharsetInfo.getValueAsBoolean();
	}

	
	public void setUseDynamicCharsetInfo(boolean flag) {
		this.useDynamicCharsetInfo.setValue(flag);
	}

	
	public String getClientInfoProvider() {
		return this.clientInfoProvider.getValueAsString();
	}

	
	public void setClientInfoProvider(String classname) {
		this.clientInfoProvider.setValue(classname);
	}
	
	public boolean getPopulateInsertRowWithDefaultValues() {
		return this.populateInsertRowWithDefaultValues.getValueAsBoolean();
	}

	public void setPopulateInsertRowWithDefaultValues(boolean flag) {
		this.populateInsertRowWithDefaultValues.setValue(flag);
	}
	
	public String getLoadBalanceStrategy() {
		return this.loadBalanceStrategy.getValueAsString();
	}

	public void setLoadBalanceStrategy(String strategy) {
		this.loadBalanceStrategy.setValue(strategy);
	}
	
	public boolean getTcpNoDelay() {
		return this.tcpNoDelay.getValueAsBoolean();
	}

	public void setTcpNoDelay(boolean flag) {
		this.tcpNoDelay.setValue(flag);
	}

	public boolean getTcpKeepAlive() {
		return this.tcpKeepAlive.getValueAsBoolean();
	}

	public void setTcpKeepAlive(boolean flag) {
		this.tcpKeepAlive.setValue(flag);
	}

	public int getTcpRcvBuf() {
		return this.tcpRcvBuf.getValueAsInt();
	}

	public void setTcpRcvBuf(int bufSize) {
		this.tcpRcvBuf.setValue(bufSize);
	}

	public int getTcpSndBuf() {
		return this.tcpSndBuf.getValueAsInt();
	}

	public void setTcpSndBuf(int bufSize) {
		this.tcpSndBuf.setValue(bufSize);
	}

	public int getTcpTrafficClass() {
		return this.tcpTrafficClass.getValueAsInt();
	}

	public void setTcpTrafficClass(int classFlags) {
		this.tcpTrafficClass.setValue(classFlags);
	}
	
	public boolean getUseNanosForElapsedTime() {
		return this.useNanosForElapsedTime.getValueAsBoolean();
	}

	public void setUseNanosForElapsedTime(boolean flag) {
		this.useNanosForElapsedTime.setValue(flag);
	}

	public long getSlowQueryThresholdNanos() {
		return this.slowQueryThresholdNanos.getValueAsLong();
	}

	public void setSlowQueryThresholdNanos(long nanos) {
		this.slowQueryThresholdNanos.setValue(nanos);
	}

	public String getStatementInterceptors() {
		return this.statementInterceptors.getValueAsString();
	}

	public void setStatementInterceptors(String value) {
		this.statementInterceptors.setValue(value);
	}

	public boolean getUseDirectRowUnpack() {
		return this.useDirectRowUnpack.getValueAsBoolean();
	}

	public void setUseDirectRowUnpack(boolean flag) {
		this.useDirectRowUnpack.setValue(flag);
	}

	public String getLargeRowSizeThreshold() {
		return this.largeRowSizeThreshold.getValueAsString();
	}

	public void setLargeRowSizeThreshold(String value) {
		try {
			this.largeRowSizeThreshold.setValue(value);
		} catch (SQLException sqlEx) {
			RuntimeException ex = new RuntimeException(sqlEx.getMessage());
			ex.initCause(sqlEx);
			
			throw ex;
		}
	}

	public boolean getUseBlobToStoreUTF8OutsideBMP() {
		return this.useBlobToStoreUTF8OutsideBMP.getValueAsBoolean();
	}

	public void setUseBlobToStoreUTF8OutsideBMP(boolean flag) {
		this.useBlobToStoreUTF8OutsideBMP.setValue(flag);
	}

	public String getUtf8OutsideBmpExcludedColumnNamePattern() {
		return this.utf8OutsideBmpExcludedColumnNamePattern.getValueAsString();
	}

	public void setUtf8OutsideBmpExcludedColumnNamePattern(String regexPattern) {
		this.utf8OutsideBmpExcludedColumnNamePattern.setValue(regexPattern);
	}

	public String getUtf8OutsideBmpIncludedColumnNamePattern() {
		return this.utf8OutsideBmpIncludedColumnNamePattern.getValueAsString();
	}

	public void setUtf8OutsideBmpIncludedColumnNamePattern(String regexPattern) {
		this.utf8OutsideBmpIncludedColumnNamePattern.setValue(regexPattern);
	}
	
	public boolean getIncludeInnodbStatusInDeadlockExceptions() {
		return this.includeInnodbStatusInDeadlockExceptions.getValueAsBoolean();
	}

	public void setIncludeInnodbStatusInDeadlockExceptions(boolean flag) {
		this.includeInnodbStatusInDeadlockExceptions.setValue(flag);
	}
	
	public boolean getBlobsAreStrings() {
        return this.blobsAreStrings.getValueAsBoolean();
    }

	public void setBlobsAreStrings(boolean flag) {
        this.blobsAreStrings.setValue(flag);
    }

    public boolean getFunctionsNeverReturnBlobs() {
        return this.functionsNeverReturnBlobs.getValueAsBoolean();
    }

    public void setFunctionsNeverReturnBlobs(boolean flag) {
        this.functionsNeverReturnBlobs.setValue(flag);
    }

	public boolean getAutoSlowLog() {
		return this.autoSlowLog.getValueAsBoolean();
	}

	public void setAutoSlowLog(boolean flag) {
		this.autoSlowLog.setValue(flag);
	}

	public String getConnectionLifecycleInterceptors() {
		return this.connectionLifecycleInterceptors.getValueAsString();
	}

	public void setConnectionLifecycleInterceptors(String interceptors) {
		this.connectionLifecycleInterceptors.setValue(interceptors);
    }

	public String getProfilerEventHandler() {
		return this.profilerEventHandler.getValueAsString();
	}

	public void setProfilerEventHandler(String handler) {
		this.profilerEventHandler.setValue(handler);
	}

	public boolean getVerifyServerCertificate() {
		return this.verifyServerCertificate.getValueAsBoolean();
	}

	public void setVerifyServerCertificate(boolean flag) {
		this.verifyServerCertificate.setValue(flag);
	}

	public boolean getUseLegacyDatetimeCode() {
		return this.useLegacyDatetimeCode.getValueAsBoolean();
	}

	public void setUseLegacyDatetimeCode(boolean flag) {
		this.useLegacyDatetimeCode.setValue(flag);
	}

	public int getSelfDestructOnPingSecondsLifetime() {
		return this.selfDestructOnPingSecondsLifetime.getValueAsInt();
	}

	public void setSelfDestructOnPingSecondsLifetime(int seconds) {
		this.selfDestructOnPingSecondsLifetime.setValue(seconds);
	}

	public int getSelfDestructOnPingMaxOperations() {
		return this.selfDestructOnPingMaxOperations.getValueAsInt();
	}

	public void setSelfDestructOnPingMaxOperations(int maxOperations) {
		this.selfDestructOnPingMaxOperations.setValue(maxOperations);
	}

	public boolean getUseColumnNamesInFindColumn() {
		return this.useColumnNamesInFindColumn.getValueAsBoolean();
	}

	public void setUseColumnNamesInFindColumn(boolean flag) {
		this.useColumnNamesInFindColumn.setValue(flag);
	}

	public boolean getUseLocalTransactionState() {
		return this.useLocalTransactionState.getValueAsBoolean();
	}

	public void setUseLocalTransactionState(boolean flag) {
		this.useLocalTransactionState.setValue(flag);
	}

	public boolean getCompensateOnDuplicateKeyUpdateCounts() {
		return this.compensateOnDuplicateKeyUpdateCounts.getValueAsBoolean();
	}

	public void setCompensateOnDuplicateKeyUpdateCounts(boolean flag) {
		this.compensateOnDuplicateKeyUpdateCounts.setValue(flag);
	}

	public int getLoadBalanceBlacklistTimeout() {
		return loadBalanceBlacklistTimeout.getValueAsInt();
	}

	public void setLoadBalanceBlacklistTimeout(int loadBalanceBlacklistTimeout) {
		this.loadBalanceBlacklistTimeout.setValue(loadBalanceBlacklistTimeout);
	}
	
	public void setRetriesAllDown(int retriesAllDown) {
		this.retriesAllDown.setValue(retriesAllDown);
	}
	
	public int getRetriesAllDown() {
		return this.retriesAllDown.getValueAsInt();
	}

	public void setUseAffectedRows(boolean flag) {
		this.useAffectedRows.setValue(flag);
	}

	public boolean getUseAffectedRows() {
		return this.useAffectedRows.getValueAsBoolean();
	}

	public void setPasswordCharacterEncoding(String characterSet) {
		this.passwordCharacterEncoding.setValue(characterSet);
	}

	public String getPasswordCharacterEncoding() {
		return this.passwordCharacterEncoding.getValueAsString();
	}

	public void setExceptionInterceptors(String exceptionInterceptors) {
		this.exceptionInterceptors.setValue(exceptionInterceptors);
	}

	public String getExceptionInterceptors() {
		return this.exceptionInterceptors.getValueAsString();
	}
	
	public void setMaxAllowedPacket(int  max) {
		this.maxAllowedPacket.setValue(max);
	}
	
	public int getMaxAllowedPacket() {
		return this.maxAllowedPacket.getValueAsInt();
	}

	public boolean getQueryTimeoutKillsConnection() {
		return this.queryTimeoutKillsConnection.getValueAsBoolean();
	}

	public void setQueryTimeoutKillsConnection(boolean queryTimeoutKillsConnection) {
		this.queryTimeoutKillsConnection.setValue(queryTimeoutKillsConnection);
	}
}
