public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> topAccounts(String ownerId){
        System.debug('ownerId : '+ownerId);
        List<Account> acctList = [SELECT Id, Name, AnnualRevenue, Phone, Website, AccountNumber
        FROM Account
        WHERE OwnerId = :ownerId
        ORDER BY AnnualRevenue DESC NULLS LAST LIMIT 5];
        System.Debug(acctList);
        return acctList;
    }
}