public with sharing class CreditCheckContinuation {

    @AuraEnabled(continuation=true)
    public static Object creditCheckAPI(String accountId){

        //determine the endpoint url - make sure you add to remote site settings
        String url = 'https://splx201-developer-edition.na124.force.com/creditcheck';

        System.Debug('AccountId: '+AccountId);
        Continuation con = new Continuation(60);
        con.ContinuationMethod = 'processResponse';
        con.state = 'Hello';

        Account acct = [SELECT Id, Name, Owner.Email, Owner.Name FROM Account WHERE Id = :AccountId LIMIT 1];

        url += '?name=' + EncodingUtil.urlEncode(acct.Name, 'UTF-8')
            + '&email=' + acct.Owner.Email
            + '&requestor=' + EncodingUtil.urlEncode(acct.Owner.Name, 'UTF-8');


        system.debug('Final Endpoint: '+ url);

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        con.addHttpRequest(req);

        return con;

    }

    @AuraEnabled
    public static Object processResponse(List<String> labels, Object state){
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}