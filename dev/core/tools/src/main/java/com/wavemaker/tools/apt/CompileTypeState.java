package com.wavemaker.tools.apt;

import java.util.HashMap;
import java.util.Map;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;

public class CompileTypeState implements TypeState {

	private final Map<String, TypeDefinition> knownTypes = new HashMap<String, TypeDefinition>();

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.json.type.TypeState#addType(com.wavemaker.json.type.
	 * TypeDefinition)
	 */
	public void addType(TypeDefinition typeDefinition) {
		knownTypes.put(typeDefinition.getTypeName(), typeDefinition);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.json.type.TypeState#getType(java.lang.String)
	 */
	public TypeDefinition getType(String typeName) {

		if (knownTypes.containsKey(typeName)) {
			return knownTypes.get(typeName);
		} else {
			return null;
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.json.type.TypeState#isTypeKnown(java.lang.String)
	 */
	public boolean isTypeKnown(String typeName) {

		return knownTypes.containsKey(typeName);
	}
}
