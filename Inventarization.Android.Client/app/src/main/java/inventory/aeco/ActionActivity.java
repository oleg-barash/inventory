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
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;
import java.util.UUID;
import java.text.SimpleDateFormat;
import java.util.LinkedList;

import inventory.R;
import inventory.aeco.network.models.ActionStatus;
import inventory.aeco.network.models.Action;
import inventory.aeco.network.models.Item;
import inventory.aeco.network.models.Zone;


public class ActionActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    public static final String ZONE_MESSAGE = "com.inventorization.ZONE";
    private EditText showScanResult;
    private EditText quantity;
    private TextView zone_title;

    private Button findButton;
    private Button okButton;
    private Button closeButton;
    private TextView description;

    private ListView historyList;
    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private int errorSoundid;
    private boolean isScaning = false;
    private String currentZone;
    private ActionType currentActionType;
    private String inventorizationId = "81d51f07-9ff3-46c0-961c-c8ebfb7b47e3";
    Action newAction;
    private static LinkedList<String> actionList = new LinkedList<>();

    ArrayAdapter<String> adapter;

    private void showToast(CharSequence text){
        Context appContext = getApplicationContext();
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(appContext, text, duration);
        toast.show();
    }

    private String login;
    public ActionActivity(){
        SharedPreferences settings = getSharedPreferences("UserInfo", 0);
        login = settings.getString("login", "undefined");
    }

    private static final String TAG = "ActionActivity";
    private String baseUrl = Configuration.BaseUrl + "inventorization/" + inventorizationId + "/";
    private String baseZoneUrl = Configuration.BaseUrl + "zone/";
    private String baseActionUrl = Configuration.BaseUrl + "action/";
    private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            isScaning = false;
            soundpool.play(soundid, 1, 1, 0, 0, 1);
            showScanResult.setText("");
            mVibrator.vibrate(100);
            byte[] barcode = intent.getByteArrayExtra("barocode");
            int barcodeLen = intent.getIntExtra("length", 0);

            addAction(new String(barcode, 0, barcodeLen));

        }

    };

    private void addAction(String code){
        newAction = new Action();
        newAction.BarCode = code;
        showScanResult.setText(newAction.BarCode);
        newAction.Id = UUID.randomUUID().toString();
        newAction.Quantity = 1;
        newAction.Type = currentActionType;
        newAction.Zone = currentZone;
        newAction.Inventorization = inventorizationId;
        newAction.User = login;
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("id", newAction.Id);
        params.put("quantity", newAction.Quantity.toString());
        params.put("type", newAction.Type.toString());
        params.put("barCode", newAction.BarCode);
        params.put("inventorization", newAction.Inventorization);
        params.put("zone", newAction.Zone);
        params.put("user", newAction.User);
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
                                description.setText(item.foundItem.Description);
                                description.setBackgroundColor(Color.argb(128, 0, 0, 64));
                                newAction.Status = ActionStatus.Sent;
                                actionList.addFirst(newAction.BarCode + " зафиксирован");
                            }
                            else{
                                newAction.Status = ActionStatus.Error;
                                soundpool.play(errorSoundid, 1, 1, 0, 0, 1);
                                description.setText(" Товар не найден.");
                                description.setBackgroundColor(Color.RED);
                            }
                            if (actionList.size() > 4){
                                actionList.removeLast();
                            }
                            adapter.notifyDataSetChanged();
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing item: " + response.toString());
                        }
                        catch (Exception exception){
                            Log.e(TAG, "Error : " + response.toString());
                        }


                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                showScanResult.setText("");
                newAction.Status = ActionStatus.Error;
                String text = newAction.BarCode;
                if (error.networkResponse != null){
                    if (error.networkResponse != null && error.networkResponse.statusCode == 403){
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
        });
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

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, baseZoneUrl + currentZone,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            Zone zone = mapper.readValue(response.toString(), Zone.class);
                            zone_title.setText(zone.Name);
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing zone: " + response.toString());
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                showToast("Ошибка при получении информации о зоне. Код " + error.networkResponse.statusCode);
            }
        });
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(stringRequest);

    }

    private void initScan() {
        // TODO Auto-generated method stub
        mScanManager = new ScanManager();
        mScanManager.openScanner(); 
      
        mScanManager.switchOutputMode( 0);
        soundpool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 100); // MODE_RINGTONE
        soundid = soundpool.load("/etc/Scan_new.ogg", 1);
        errorSoundid = soundpool.load("/etc/Scan_new.ogg", 1);
    }

    private void setupView() {
        // TODO Auto-generated method stub
        showScanResult = (EditText) findViewById(R.id.scan_result);
        showScanResult.setInputType(InputType.TYPE_NULL);
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
                    findButton.setEnabled(true);
                }
                else {
                    findButton.setEnabled(false);
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
                okButton.setEnabled(!quantity.getText().toString().isEmpty());
            }
        };

        quantity.addTextChangedListener(fieldValidatorTextWatcher);
        quantity.setInputType(InputType.TYPE_NULL);

        okButton = (Button) findViewById(R.id.okButton);
        okButton.setOnClickListener(new OnClickListener() {
                                        @Override
                                        public void onClick(View arg0) {
                                            updateQuantity();
                                        }
                                    });

        closeButton = (Button) findViewById(R.id.closeButton);
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
                                    HashMap<String, String> params = new HashMap<String, String>();
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
                                    });
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

        findButton = (Button) findViewById(R.id.findButton);
        findButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                addAction(showScanResult.getText().toString());
            }
        });

        description = (TextView) findViewById(R.id.description);
        zone_title =  (TextView) findViewById(R.id.zone_title);
        zone_title.setInputType(InputType.TYPE_NULL);
        historyList = (ListView)findViewById(R.id.historyList);
        adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, actionList);
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
            isScaning = false;
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
        // TODO Auto-generated method stub
        super.onStart();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // TODO Auto-generated method stub
        return super.onKeyDown(keyCode, event);
    }

    public void updateQuantity(){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        newAction.Quantity = Integer.parseInt(quantity.getText().toString());
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("quantity", newAction.Quantity.toString());
        JsonObjectRequest jsonRequest = new JsonObjectRequest(baseActionUrl + newAction.Id, new JSONObject(params),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        //newAction.Status = ActionStatus.Sent;
                        newAction = new Action();
                        showScanResult.setText("");
                        showToast("Изменение количества товара успешно зафиксировано.");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                newAction.Status = ActionStatus.Error;
                if (error.networkResponse != null) {
                    showToast("Ошибка изменении количества товара. Код " + error.networkResponse.statusCode);
                }
                else{
                    showToast("Ошибка изменении количества товара.");
                }

            }
        });
        queue.add(jsonRequest);
    }

}
