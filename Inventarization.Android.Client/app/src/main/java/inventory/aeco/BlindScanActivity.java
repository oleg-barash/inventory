package inventory.aeco;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.app.Activity;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;

import inventory.R;
import inventory.aeco.network.models.Action;
import inventory.aeco.network.models.ActionStatus;
import inventory.aeco.network.models.Zone;

import static java.util.UUID.randomUUID;

public class BlindScanActivity extends Activity {
    private String currentZone;
    private ActionType currentActionType;
    private EditText quantity;
    private Button okButton;
    private String token;
    private static final String TAG = "BlindScanActivity";
    private String baseUrl;
    private TextView zone_title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_blind_scan);
        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        currentZone = extras.getString(ActionActivity.ZONE_MESSAGE);
        SharedPreferences settings = getSharedPreferences("UserInfo", 0);
        token = settings.getString("token", "undefined");
        UUID inventorization = UUID.fromString(settings.getString("inventorization", "undefined"));
        baseUrl = Configuration.BaseUrl + "inventorization/" + inventorization.toString() + "/";
        currentActionType = ActionType.valueOf(extras.getString(ZoneSelectActivity.ACTION_TYPE_MESSAGE));

        quantity = (EditText) findViewById(R.id.quantity);
        //quantity.setInputType(InputType.TYPE_NULL);

        okButton = (Button) findViewById(R.id.apply);
        okButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                setQuantity();
            }
        });

        zone_title =  (TextView) findViewById(R.id.zoneLabel);
        zone_title.setInputType(InputType.TYPE_NULL);

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, Configuration.BaseUrl + "zone/" + currentZone,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            Zone zone = mapper.readValue(response, Zone.class);
                            zone_title.setText(zone.Name);
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing zone: " + response);
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                showToast("Ошибка при получении информации о зоне. Код " + error.networkResponse.statusCode);
            }
        }){
            @Override
            public Map<String, String> getHeaders(){
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(stringRequest);
        setupView();
    }

    @Override
    public void onBackPressed() {
        // do nothing
    }

    private void setupView() {
        Button closeButton = (Button) findViewById(R.id.closeButton);
        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {

                new AlertDialog.Builder(BlindScanActivity.this)
                        .setTitle("Закрытие зоны")
                        .setMessage("После закрытия зоны добавление товара в зону будет запрещено. Для повторного открытия нужно будет обратиться к менеджеру. Закрыть зону?")
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(R.string.close_zone, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int whichButton) {
                                try {
                                    RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
                                    HashMap<String, String> params = new HashMap<>();
                                    params.put("zoneId", currentZone);
                                    JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, baseUrl + "zone/close"
                                            , new JSONObject(params),
                                            new Response.Listener<JSONObject>() {
                                                @Override
                                                public void onResponse(JSONObject response) {
                                                    showToast("Зона закрыта");
                                                    Intent intent = new Intent(BlindScanActivity.this, ZoneSelectActivity.class);
                                                    Bundle extras = new Bundle();
                                                    extras.putString(ZoneSelectActivity.ACTION_TYPE_MESSAGE, currentActionType.toString());
                                                    intent.putExtras(extras);
                                                    startActivity(intent);
                                                }
                                            }, new Response.ErrorListener() {
                                        @Override
                                        public void onErrorResponse(VolleyError error) {
                                            if (error.networkResponse != null) {
                                                if (error.networkResponse.statusCode == 403) {
                                                    showToast("Зона уже закрыта");
                                                    Intent intent = new Intent(BlindScanActivity.this, ZoneSelectActivity.class);
                                                    startActivity(intent);
                                                } else {
                                                    showToast("Ошибка при закрытии зоны. Код " + error.networkResponse.statusCode);
                                                }
                                            } else {
                                                showToast("Ошибка при закрытии зоны. Текст ошибки " + error.getMessage());
                                            }
                                        }
                                    }) {
                                        @Override
                                        public Map<String, String> getHeaders() {
                                            Map<String, String> headers = new HashMap<>();
                                            headers.put("Authorization", token);
                                            return headers;
                                        }
                                    };
                                    queue.add(request);
                                } catch (Exception ex) {
                                    showToast("Ошибка при закрытии зоны.");
                                    Log.e(TAG, ex.getMessage());
                                }
                            }
                        })
                        .setNegativeButton(R.string.no, null).show();


            }
        });
    }

    public void setQuantity(){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        HashMap<String, String> params = new HashMap<>();
        params.put("id", randomUUID().toString());
        params.put("quantity", quantity.getText().toString());
        params.put("type", ActionType.BlindScan.toString());
        params.put("zone", currentZone);
        SimpleDateFormat formatUTC = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
        formatUTC.setTimeZone(TimeZone.getTimeZone("UTC"));
        params.put("dateTime", formatUTC.format(new Date()));
        JsonObjectRequest jsonRequest = new JsonObjectRequest(baseUrl + "action", new JSONObject(params),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        showToast("Количество товара успешно зафиксировано.");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                if (error.networkResponse != null) {
                    showToast("Ошибка изменении количества товара. Код " + error.networkResponse.statusCode);
                }
                else{
                    showToast("Ошибка изменении количества товара.");
                }

            }
        }){
            @Override
            public Map<String, String> getHeaders(){
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };
        jsonRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(jsonRequest);
    }

    private void showToast(CharSequence text){
        Context appContext = getApplicationContext();
        int duration = Toast.LENGTH_LONG;
        Toast toast = Toast.makeText(appContext, text, duration);
        toast.show();
    }


}
