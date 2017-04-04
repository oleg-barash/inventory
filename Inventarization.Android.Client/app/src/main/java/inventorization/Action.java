package inventorization;

import java.util.Date;

/**
 * Created by Барашики on 04.04.2017.
 */


public class Action {
    public String Id;
    public Date DateTime;
    public ActionType Type;
    public String UserId;
    public String BarCode;
    public String Zone;
    public String Inventorization;
    public Integer Quantity;
    public ActionStatus Status;
}
