package inventory.aeco;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.device.ScanManager;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.app.Activity;
import android.os.Vibrator;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.fasterxml.jackson.databind.ObjectMapper;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;

import inventory.R;

public class ZoneSelectActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    private boolean isScaning = false;
    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private Button okButton;
    private Button createButton;
    private Button findButton;
    private EditText showScanResult;
    private TextView resultTextView;
    private Zone zone;
    private static final String TAG = "ZoneSelectActivity";
    private String inventorizationId = "81d51f07-9ff3-46c0-961c-c8ebfb7b47e3";
    private String baseUrl = "http://192.168.0.106/api/zone";
    private String baseInventorizationUrl = "http://192.168.0.106/api/inventorization/" + inventorizationId + "/";
    private ZoneActivityStates currentState = ZoneActivityStates.Initial;

    private void initScan() {
        // TODO Auto-generated method stub
        mScanManager = new ScanManager();
        mScanManager.openScanner();
        mScanManager.switchOutputMode( 0);
        soundpool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 100); // MODE_RINGTONE
        soundid = soundpool.load("/etc/Scan_new.ogg", 1);
    }


    private void showToast(CharSequence text){
        Context appContext = getApplicationContext();
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(appContext, text, duration);
        toast.show();
    }

    private void openZone(String code){
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, baseInventorizationUrl + "/zone/open?code=" + code,
                            new Response.Listener<String>()  {
                                @Override
                    public void onResponse(String response) {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            zone = mapper.readValue(response.toString(), Zone.class);
                            Intent intent = new Intent(ZoneSelectActivity.this, ActionActivity.class);
                            intent.putExtra(ActionActivity.ZONE_MESSAGE, zone.Id);
                            startActivity(intent);
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing zone: " + response.toString());
                            setState(ZoneActivityStates.Error);
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                setState(ZoneActivityStates.Initial);
                if (error.networkResponse.statusCode == 403) {
                    showToast("Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                }
                else {
                    showToast("Ошибка при получении информации о зоне. Код " + error.networkResponse.statusCode);
                }

            }
        });
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(stringRequest);
    }


    private void setupView() {
        // TODO Auto-generated method stub
        showScanResult = (EditText) findViewById(R.id.scan_result);
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
                if (s != "" && currentState != ZoneActivityStates.Finding)
                {
                    setState(ZoneActivityStates.Finding);
                }
            }
        });
        resultTextView = (TextView) findViewById(R.id.resultTextView);
        createButton = (Button) findViewById(R.id.createButton);
        createButton.setOnClickListener(new View.OnClickListener() {
                                            @Override
                                            public void onClick(View arg0) {
                                                if (showScanResult.getText() != null && !showScanResult.getText().toString().isEmpty()) {
                                                    openZone(showScanResult.getText().toString());
                                                }
                                                else{
                                                    showToast("Просканируйте зону, либо укажите номер зоны при помощи клавиатуры");
                                                }
                                            }
                                        });
        okButton = (Button) findViewById(R.id.okButton);
        okButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                if (showScanResult.getText() != null && !showScanResult.getText().toString().isEmpty()) {
                    openZone(showScanResult.getText().toString());
                }
                else{
                    showToast("Просканируйте зону, либо укажите номер зоны при помощи клавиатуры");
                }
            }
        });

        findButton = (Button) findViewById(R.id.findButton);
        findButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                if(showScanResult.getText() != null && !showScanResult.getText().toString().isEmpty()) {
                    searchZone(showScanResult.getText().toString());
                }
                else{
                    showToast("Укажите зону");
                }
            }
        });
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
    }

    private void setState(ZoneActivityStates state){
        currentState = state;
        switch (state){
            case Initial:
                okButton.setEnabled(false);
                findButton.setEnabled(false);
                createButton.setEnabled(false);
                break;
            case ZoneFound:
                if (zone.Id == ""){
                    setState(ZoneActivityStates.Error);
                    return;
                }
                okButton.setEnabled(true);
                findButton.setEnabled(false);
                createButton.setEnabled(false);
                break;
            case ZoneCreated:
                okButton.setEnabled(true);
                findButton.setEnabled(false);
                createButton.setEnabled(false);
                break;
            case ZoneNotFound:
                okButton.setEnabled(false);
                findButton.setEnabled(false);
                createButton.setEnabled(true);
                break;
            case Error:
                okButton.setEnabled(false);
                findButton.setEnabled(false);
                createButton.setEnabled(false);
                break;
            case Finding:
                okButton.setEnabled(false);
                findButton.setEnabled(true);
                createButton.setEnabled(false);
                break;
            default:
                okButton.setEnabled(false);
                findButton.setEnabled(false);
                createButton.setEnabled(false);
                break;
        }
    }

    private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            isScaning = false;
            soundpool.play(soundid, 1, 1, 0, 0, 1);
            showScanResult.setText("");
            mVibrator.vibrate(100);

            byte[] barcode = intent.getByteArrayExtra("barocode");
            int barocodelen = intent.getIntExtra("length", 0);
            byte temp = intent.getByteExtra("barcodeType", (byte) 0);
            Log.i("debug", "----codetype--" + temp);
            String barcodeStr = new String(barcode, 0, barocodelen);
            showScanResult.setText(barcodeStr);
            searchZone(showScanResult.getText().toString());
        }

    };

    private void searchZone(String code){
        try {
            RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
            StringRequest stringRequest = new StringRequest(Request.Method.GET, baseInventorizationUrl + "/zone?code=" + code,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            try {
                                ObjectMapper mapper = new ObjectMapper();
                                zone = mapper.readValue(response.toString(), Zone.class);
                                resultTextView.setText(zone.Name);
                                showToast("Зона найдена");
                                setState(ZoneActivityStates.ZoneFound);
                            }
                            catch (Exception exception){
                                Log.e(TAG, "Error parsing zone: " + response.toString());
                                setState(ZoneActivityStates.Error);
                            }

                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    if (error.networkResponse.statusCode == 404){
                        setState(ZoneActivityStates.ZoneNotFound);
                        showToast("Зона не найдена. Вы можете создать её.");
                    }
                    else if (error.networkResponse.statusCode == 403) {
                        setState(ZoneActivityStates.Initial);
                        showToast("Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                    }
                    else {
                        setState(ZoneActivityStates.Error);
                        showToast("Ошибка при получении информации о зоне. Код " + error.networkResponse.statusCode);
                    }
                }
            });
            stringRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
            queue.add(stringRequest);
        }
        catch (Exception ex){
            showToast(ex.getMessage());
        }
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_zone_select);
        mVibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        setupView();
    }

}