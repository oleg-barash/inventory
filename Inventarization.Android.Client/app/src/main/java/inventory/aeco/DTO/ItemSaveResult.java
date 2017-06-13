package inventory.aeco.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import inventory.aeco.network.models.*;

/**
 * Created by Барашики on 22.05.2017.
 */

public class ItemSaveResult {
    @JsonIgnoreProperties
    public Item foundItem;
}
