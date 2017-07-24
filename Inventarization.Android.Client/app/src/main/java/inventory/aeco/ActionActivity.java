package inventory.aeco;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.os.Vibrator;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.device.ScanManager;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.app.AlertDialog;
import android.content.DialogInterface;


import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;
import java.text.SimpleDateFormat;
import java.util.LinkedList;

import inventory.R;
import inventory.aeco.DTO.ItemSaveResult;
import inventory.aeco.network.models.ActionStatus;
import inventory.aeco.network.models.Action;
import inventory.aeco.network.models.Zone;

import static java.util.UUID.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ActionActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    public static final String ZONE_MESSAGE = "com.inventorization.ZONE";
    private EditText showScanResult;
    private EditText quantity;
    private TextView zone_title;

    private Button addButton;
    private Button okButton;
    private TextView description;

    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private int errorSoundid;
    private String currentZone;
    private ActionType currentActionType;
    Action currentAction;
    private static LinkedList<String> actionList = new LinkedList<>();

    ArrayAdapter<String> adapter;

    private void showToast(CharSequence text){
        Context appContext = getApplicationContext();
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(appContext, text, duration);
        toast.show();
    }

    private String token;
    private static final String TAG = "ActionActivity";
    private String baseUrl;
    private String baseZoneUrl = Configuration.BaseUrl + "zone/";
    private String baseActionUrl = Configuration.BaseUrl + "action/";
    private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            soundpool.play(soundid, 1, 1, 0, 0, 1);
            showScanResult.setText("");
            mVibrator.vibrate(100);
            byte[] barcode = intent.getByteArrayExtra("barocode");
            int barcodeLen = intent.getIntExtra("length", 0);

            addAction(new String(barcode, 0, barcodeLen));

        }

    };

    private void addAction(String code){
        currentAction = new Action();
        currentAction.BarCode = code;
        showScanResult.setText(currentAction.BarCode);
        currentAction.Id = randomUUID().toString();
        try {
            currentAction.Quantity = Integer.parseInt(quantity.getText().toString());
        }
        catch (Exception ex){
            currentAction.Quantity = 1;
            quantity.setText("1");
        }
        currentAction.Type = currentActionType;
        currentAction.Zone = currentZone;
        HashMap<String, String> params = new HashMap<>();
        params.put("id", currentAction.Id);
        params.put("quantity", currentAction.Quantity.toString());
        params.put("type", currentAction.Type.toString());
        params.put("barCode", currentAction.BarCode);
        params.put("inventorization", currentAction.Inventorization);
        params.put("zone", currentAction.Zone);
        SimpleDateFormat formatUTC = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
        formatUTC.setTimeZone(TimeZone.getTimeZone("UTC"));
        params.put("dateTime", formatUTC.format(new Date()));

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());

        JsonObjectRequest jsonRequest = new JsonObjectRequest(baseUrl + "action", new JSONObject(params),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try{
                            ObjectMapper mapper = new ObjectMapper();
                            ItemSaveResult item = mapper.readValue(response.toString(), ItemSaveResult.class);
                            if (item.foundItem != null) {
                                description.setText(item.foundItem.Name);
                                description.setBackgroundColor(Color.argb(128, 0, 0, 64));
                                currentAction.Status = ActionStatus.Sent;
                                actionList.addFirst(currentAction.BarCode + " зафиксирован");
                                quantity.setText("1");
                            }
                            else{
                                currentAction.Status = ActionStatus.Error;
                                soundpool.play(errorSoundid, 1, 1, 0, 0, 1);
                                description.setText(" Товар не найден.");
                                description.setBackgroundColor(Color.RED);
                                actionList.addFirst(currentAction.BarCode + " зафиксирован");
                            }
                            if (actionList.size() > 4){
                                actionList.removeLast();
                            }
                            adapter.notifyDataSetChanged();
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing item: " + response.toString());
                            showToast("Ошибка: " + response.toString());
                        }


                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                showScanResult.setText("");
                currentAction.Status = ActionStatus.Error;
                String text = currentAction.BarCode;
                if (error.networkResponse != null){
                    if (error.networkResponse.statusCode == 403){
                        showToast("Зона уже закрыта. Выберите другую зону.");
                        Intent intent = new Intent(ActionActivity.this, ZoneSelectActivity.class);
                        startActivity(intent);
                        text += " не был добавлен в зону";
                    }
                    else {
                        showToast("Ошибка при регистрации штрих-кода: " + error.toString());
                    }
                }
                actionList.addFirst(text);
                if (actionList.size() > 4){
                    actionList.removeLast();
                }
                adapter.notifyDataSetChanged();
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_main);
        mVibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        setupView();


        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        currentZone = extras.getString(ActionActivity.ZONE_MESSAGE);
        currentActionType = ActionType.valueOf(extras.getString(ZoneSelectActivity.ACTION_TYPE_MESSAGE));

        SharedPreferences settings = getSharedPreferences("UserInfo", 0);
        token = settings.getString("token", "undefined");
        UUID inventorization = UUID.fromString(settings.getString("inventorization", "undefined"));
        baseUrl = Configuration.BaseUrl + "inventorization/" + inventorization.toString() + "/";

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, baseZoneUrl + currentZone,
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
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
    }

    private void initScan() {
        // TODO Auto-generated method stub
        //mScanManager = new ScanManager();
        //mScanManager.openScanner();
      
        //mScanManager.switchOutputMode( 0);
        soundpool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 100); // MODE_RINGTONE
        soundid = soundpool.load("/etc/Scan_new.ogg", 1);
        errorSoundid = soundpool.load("/etc/Scan_new.ogg", 1);
    }

    private void setupView() {
        // TODO Auto-generated method stub
        showScanResult = (EditText) findViewById(R.id.scan_result);
        //showScanResult.setInputType(InputType.TYPE_NULL);
        showScanResult.setText("4601835000706");
        showScanResult.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0) {
                    addButton.setEnabled(true);
                }
                else {
                    addButton.setEnabled(false);
                }
            }
        });

        quantity = (EditText) findViewById(R.id.quantity);

        TextWatcher fieldValidatorTextWatcher = new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!quantity.getText().toString().isEmpty() && currentAction != null) {
                    try {
                        int quantityValue = Integer.parseInt(quantity.getText().toString());
                        okButton.setEnabled( quantityValue != currentAction.Quantity);
                    } catch (Exception ex) {
                        okButton.setEnabled(false);
                    }
                }
                else{
                    okButton.setEnabled(false);
                }
            }
        };

        quantity.addTextChangedListener(fieldValidatorTextWatcher);
        //quantity.setInputType(InputType.TYPE_NULL);

        okButton = (Button) findViewById(R.id.okButton);
        okButton.setOnClickListener(new OnClickListener() {
                                        @Override
                                        public void onClick(View arg0) {
                                            updateQuantity();
                                        }
                                    });

        Button closeButton = (Button) findViewById(R.id.closeButton);
        closeButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {

                new AlertDialog.Builder(ActionActivity.this)
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
                                                    Intent intent = new Intent(ActionActivity.this, ZoneSelectActivity.class);
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
                                                    Intent intent = new Intent(ActionActivity.this, ZoneSelectActivity.class);
                                                    startActivity(intent);
                                                } else {
                                                    showToast("Ошибка при закрытии зоны. Код " + error.networkResponse.statusCode);
                                                }
                                            }
                                            else {
                                                showToast("Ошибка при закрытии зоны. Текст ошибки " + error.getMessage());
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
                                    queue.add(request);
                                }
                                catch (Exception ex){
                                    showToast("Ошибка при закрытии зоны.");
                                    Log.e(TAG, ex.getMessage());
                                }
                            }})
                        .setNegativeButton(R.string.no, null).show();


            }
        });

        addButton = (Button) findViewById(R.id.addButton);
        addButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                addAction(showScanResult.getText().toString());
            }
        });

        description = (TextView) findViewById(R.id.description);
        zone_title =  (TextView) findViewById(R.id.zone_title);
        zone_title.setInputType(InputType.TYPE_NULL);
        ListView historyList = (ListView) findViewById(R.id.historyList);
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, actionList);
        historyList.setAdapter(adapter);

    }
    
    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        // TODO Auto-generated method stub
        super.onPause();
        if(mScanManager != null) {
            mScanManager.stopDecode();
        }
        unregisterReceiver(mScanReceiver);
    }

    @Override
    protected void onResume() {
        // TODO Auto-generated method stub
        super.onResume();
        initScan();
        showScanResult.setText("");
        IntentFilter filter = new IntentFilter();
        filter.addAction(SCAN_ACTION);
        registerReceiver(mScanReceiver, filter);
    }

    @Override
    protected void onStart() {
        loadLastActions();
        // TODO Auto-generated method stub
        super.onStart();
    }

    @Override
    public void onBackPressed() {
        // do nothing
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // TODO Auto-generated method stub
        return super.onKeyDown(keyCode, event);
    }

    private void updateQuantity(){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        currentAction.Quantity = Integer.parseInt(quantity.getText().toString());
        HashMap<String, String> params = new HashMap<>();
        params.put("quantity", currentAction.Quantity.toString());
        JsonObjectRequest jsonRequest = new JsonObjectRequest(baseActionUrl + currentAction.Id , new JSONObject(params),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        quantity.setText(currentAction.Quantity.toString());
                        showToast("Изменение количества товара успешно зафиксировано.");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                currentAction.Status = ActionStatus.Error;
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
        queue.add(jsonRequest);
    }
    private void loadLastActions(){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        HashMap<String, String> params = new HashMap<>();
        StringRequest stringRequest = new StringRequest(Configuration.BaseUrl + "user/lastActions",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            List<Action> lastActions = mapper.readValue(response, new TypeReference<List<Action>>(){});
                            actionList.clear();
                            if (actionList.size() > 0){
                                for (int i = 0; i <= actionList.size(); i++) {
                                    actionList.addFirst(lastActions.get(i).BarCode);
                                }
                            }
                            adapter.notifyDataSetChanged();
                        }catch (IOException ex){
                            showToast("Ошибка загрузки последних действий. Код " + ex.getMessage());
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                if (error.networkResponse != null) {
                    showToast("Ошибка загрузки последних действий. Код " + error.networkResponse.statusCode);
                }
                else{
                    showToast("Ошибка загрузки последних действий.");
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
        queue.add(stringRequest);
    }
}
