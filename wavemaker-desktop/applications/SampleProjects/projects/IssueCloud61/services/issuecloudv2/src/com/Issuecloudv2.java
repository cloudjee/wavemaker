
package com;

import java.util.Date;
import java.util.List;
import com.data.Issue;
import com.data.output.GetCommentContentRtnType;
import com.data.output.GetCommentEmailsRtnType;
import com.data.output.GetIssueByCriticalRtnType;
import com.data.output.GetIssueByPriorityRtnType;
import com.data.output.GetIssueByTypeRtnType;
import com.data.output.GetIssueEmailsRtnType;
import com.data.output.GetVersionByProjectRtnType;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;


/**
 *  Operations for service "issuecloudv2"
 *  02/14/2013 09:59:54
 * 
 */
@SuppressWarnings("unchecked")
public class Issuecloudv2
    implements DataServiceManagerAccess, LiveDataService
{

    private DataServiceManager dsMgr;
    private TaskManager taskMgr;

    public com.data.output.GetMAxIssuesByProjectRtnType getMAxIssuesByProject(Integer projectid) {
        List<com.data.output.GetMAxIssuesByProjectRtnType> rtn = ((List<com.data.output.GetMAxIssuesByProjectRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getMAxIssuesByProjectQueryName), projectid));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<GetIssueByTypeRtnType> getIssueByType(Integer projectvar) {
        return ((List<GetIssueByTypeRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getIssueByTypeQueryName), projectvar));
    }

    public List<Issue> searchIssue(String quickvar, String priorityvar, String typevar, String statusvar, Integer projectvar, Integer userreportedvar, Integer userassignedvar, String descriptionvar, Date createdbeforevar, Date createdaftervar, String summaryvar, Date closedbeforevar, Date closedaftervar, Integer versionreportedvar, Integer versionfixedvar) {
        return ((List<Issue> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.searchIssueQueryName), quickvar, priorityvar, typevar, statusvar, projectvar, userreportedvar, userassignedvar, descriptionvar, createdbeforevar, createdaftervar, summaryvar, closedbeforevar, closedaftervar, versionreportedvar, versionfixedvar));
    }

    public com.data.output.GetIssueContentRtnType getIssueContent(Integer issueid) {
        List<com.data.output.GetIssueContentRtnType> rtn = ((List<com.data.output.GetIssueContentRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getIssueContentQueryName), issueid));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.output.GetProjectPrefixRtnType getProjectPrefix(Integer id) {
        List<com.data.output.GetProjectPrefixRtnType> rtn = ((List<com.data.output.GetProjectPrefixRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getProjectPrefixQueryName), id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<GetVersionByProjectRtnType> getVersionByProject(Integer projectvar) {
        return ((List<GetVersionByProjectRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getVersionByProjectQueryName), projectvar));
    }

    public List<com.data.Project> checkPrefix(String pfx) {
        return ((List<com.data.Project> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.checkPrefixQueryName), pfx));
    }

    public com.data.User getUserByEmail(String email) {
        List<com.data.User> rtn = ((List<com.data.User> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getUserByEmailQueryName), email));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<GetIssueByPriorityRtnType> getIssueByPriority(Integer projectvar) {
        return ((List<GetIssueByPriorityRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getIssueByPriorityQueryName), projectvar));
    }

    public List<com.data.User> getVerifiedEmail(Integer id) {
        return ((List<com.data.User> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getVerifiedEmailQueryName), id));
    }

    public Integer setTenantID(Integer tid, Integer uid) {
        List<Integer> rtn = ((List<Integer> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.setTenantIDQueryName), tid, uid));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.Tenant getAccountNo(Integer acno) {
        List<com.data.Tenant> rtn = ((List<com.data.Tenant> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getAccountNoQueryName), acno));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.User getUserByUserName(String username) {
        List<com.data.User> rtn = ((List<com.data.User> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getUserByUserNameQueryName), username));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<GetCommentEmailsRtnType> getCommentEmails(Integer issueid) {
        return ((List<GetCommentEmailsRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getCommentEmailsQueryName), issueid));
    }

    public List<GetCommentContentRtnType> getCommentContent(Integer issueid) {
        return ((List<GetCommentContentRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getCommentContentQueryName), issueid));
    }

    public List<GetIssueEmailsRtnType> getIssueEmails(Integer issueid) {
        return ((List<GetIssueEmailsRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getIssueEmailsQueryName), issueid));
    }

    public Integer setNewPass(String newPass, Integer uId) {
        List<Integer> rtn = ((List<Integer> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.setNewPassQueryName), newPass, uId));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.Tenant getTenantById(Integer id) {
        List<com.data.Tenant> rtn = ((List<com.data.Tenant> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getTenantByIdQueryName), id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.Project getProjectById(Integer id) {
        List<com.data.Project> rtn = ((List<com.data.Project> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getProjectByIdQueryName), id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.output.GetUserByIdRtnType getUserById(Integer id) {
        List<com.data.output.GetUserByIdRtnType> rtn = ((List<com.data.output.GetUserByIdRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getUserByIdQueryName), id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public com.data.output.GetTenantByUserRtnType getTenantByUser(Integer uid) {
        List<com.data.output.GetTenantByUserRtnType> rtn = ((List<com.data.output.GetTenantByUserRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getTenantByUserQueryName), uid));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<GetIssueByCriticalRtnType> getIssueByCritical(Integer projectvar) {
        return ((List<GetIssueByCriticalRtnType> ) dsMgr.invoke(taskMgr.getQueryTask(), (Issuecloudv2Constants.getIssueByCriticalQueryName), projectvar));
    }

    public Object insert(Object o) {
        return dsMgr.invoke(taskMgr.getInsertTask(), o);
    }

    public TypedServiceReturn read(TypeDefinition rootType, Object o, PropertyOptions propertyOptions, PagingOptions pagingOptions) {
        return ((TypedServiceReturn) dsMgr.invoke(taskMgr.getReadTask(), rootType, o, propertyOptions, pagingOptions));
    }

    public Object update(Object o) {
        return dsMgr.invoke(taskMgr.getUpdateTask(), o);
    }

    public void delete(Object o) {
        dsMgr.invoke(taskMgr.getDeleteTask(), o);
    }

    public void begin() {
        dsMgr.begin();
    }

    public void commit() {
        dsMgr.commit();
    }

    public void rollback() {
        dsMgr.rollback();
    }

    public DataServiceManager getDataServiceManager() {
        return dsMgr;
    }

    public void setDataServiceManager(DataServiceManager dsMgr) {
        this.dsMgr = dsMgr;
    }

    public TaskManager getTaskManager() {
        return taskMgr;
    }

    public void setTaskManager(TaskManager taskMgr) {
        this.taskMgr = taskMgr;
    }

}
