public with sharing class OpportunityController {

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String accountId) {

        return [SELECT Id, Name, Amount, StageName, CloseDate, IsWon, IsClosed
                FROM Opportunity
                WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    }
}