package inventorization;

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
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import android.os.AsyncTask;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;
import java.text.SimpleDateFormat;


public class ActionActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    public static final String ZONE_MESSAGE = "com.inventorization.ZONE";
    private EditText showScanResult;
    private Button mScan;
    private Button mClose;
    private TextView textView;

    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private String barcodeStr;
    private boolean isScaning = false;
    private String currentZone;
    Action newAction;
    ActionType newActionType = ActionType.FirstScan;
    List actionList = new ArrayList();

    private static final String TAG = "ActionActivity";
    private String baseUrl = "http://192.168.0.103/api/zone/";
    private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            isScaning = false;
            soundpool.play(soundid, 1, 1, 0, 0, 1);
            showScanResult.setText("");
            mVibrator.vibrate(100);
            newAction = new Action();
            byte[] barcode = intent.getByteArrayExtra("barocode");
            int barocodelen = intent.getIntExtra("length", 0);
            newAction.BarCode = new String(barcode, 0, barocodelen);
            showScanResult.setText(newAction.BarCode);
            RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
            newAction.Id = UUID.randomUUID().toString();
            newAction.Quantity = 1;
            newAction.Type = newActionType;
            newAction.Zone = currentZone;
            newAction.BarCode = UUID.randomUUID().toString();
            HashMap<String, String> params = new HashMap<String, String>();
            params.put("id", newAction.Id);
            params.put("quantity", newAction.Quantity.toString());
            params.put("type", newAction.Type.toString());
            params.put("barCode", newAction.BarCode);
            SimpleDateFormat formatUTC = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
            formatUTC.setTimeZone(TimeZone.getTimeZone("UTC"));
            params.put("dateTime", formatUTC.format(new Date()));
            actionList.add(newAction);

            JsonObjectRequest jsonRequest = new JsonObjectRequest(baseUrl + currentZone + "/action", new JSONObject(params),
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try {
                                String name = response.toString();
                                resultTextView.setText(name);
                                showToast("Зона создана");
                                setState(ZoneActivityStates.ZoneCreated);
                            }
                            catch (IOException exception){
                                Log.e(TAG, "Error parsing zone: " + response.toString());
                                setState(ZoneActivityStates.Error);
                            }

                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    setState(ZoneActivityStates.ZoneNotFound);
                    showToast("Ошибка при получении информации о зоне. Код " + error.networkResponse.statusCode);

                }
            });
            queue.add(jsonRequest);
        }

    };
    
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
        currentZone = intent.getStringExtra(ActionActivity.ZONE_MESSAGE);
    }

    private void initScan() {
        // TODO Auto-generated method stub
        mScanManager = new ScanManager();
        mScanManager.openScanner(); 
      
        mScanManager.switchOutputMode( 0);
        soundpool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 100); // MODE_RINGTONE
        soundid = soundpool.load("/etc/Scan_new.ogg", 1);
    }

    private void setupView() {
        // TODO Auto-generated method stub
        showScanResult = (EditText) findViewById(R.id.scan_result);

        mScan = (Button) findViewById(R.id.scan);
        mScan.setOnClickListener(new OnClickListener() {
            
            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub
                //if(type == 3)
                    mScanManager.stopDecode();
                    isScaning = true;
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    mScanManager.startDecode();
            }
        });
        
        mClose = (Button) findViewById(R.id.close);
        mClose.setOnClickListener(new OnClickListener() {
            
            @Override
            public void onClick(View arg0) {
                // TODO Auto-generated method stub
                if(isScaning) {
                    isScaning = false;
                    mScanManager.stopDecode();
                } 
            }
        });
        
        textView = (TextView) findViewById(R.id.textView);
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

}
