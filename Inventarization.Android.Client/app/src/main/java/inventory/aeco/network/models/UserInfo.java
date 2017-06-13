package inventory.aeco.network.models;


import java.util.UUID;

/**
 * Created by Барашики on 10.06.2017.
 */



public class UserInfo
{
    public String Token;
    public String Error;
    public String FullName;
    public Inventorization[] Inventorizations;
    public boolean IsAuthorized;
    public String Username;
    public String Password;
    public Inventorization DefaultInventorization;
}
