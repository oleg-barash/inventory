package inventory.aeco.network.models;

import java.util.Date;

import inventory.aeco.network.models.ActionStatus;
import inventory.aeco.ActionType;

/**
 * Created by Барашики on 04.04.2017.
 */


public class Action {
    public String Id;
    public Date DateTime;
    public ActionType Type;
    public String User;
    public String BarCode;
    public String Zone;
    public String Inventorization;
    public Integer Quantity;
    public ActionStatus Status;
}
