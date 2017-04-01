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

import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;
import java.text.SimpleDateFormat;


public class MainActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    public static final String ZONE_MESSAGE = "com.inventorization.ZONE";
    private EditText showScanResult;
    private Button mScan;
    private Button mClose;
    private TextView textView;
    private int type;
    private int outPut;
    
    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private String barcodeStr;
    private boolean isScaning = false;
    private String currentZone;
    private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            isScaning = false;
            soundpool.play(soundid, 1, 1, 0, 0, 1);
            showScanResult.setText("");
            mVibrator.vibrate(100);

            byte[] barcode = intent.getByteArrayExtra("barocode");
            //byte[] barcode = intent.getByteArrayExtra("barcode");
            int barocodelen = intent.getIntExtra("length", 0);
            byte temp = intent.getByteExtra("barcodeType", (byte) 0);
            android.util.Log.i("debug", "----codetype--" + temp);
            barcodeStr = new String(barcode, 0, barocodelen);

            showScanResult.setText(barcodeStr);

            try {
                String result = new ActionUploader().execute(barcodeStr).get();
                textView.setText(result);
            }
            catch (Exception ex){
                textView.setText(ex.getMessage());
            }
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
        currentZone = intent.getStringExtra(MainActivity.ZONE_MESSAGE);
    }

    private class ActionUploader extends AsyncTask<String, Void, String> {

        protected String doInBackground(String... barcodeStr) {
            HttpClient httpclient = new DefaultHttpClient();
            String address = "http://192.168.0.106/api/zone/" + currentZone + "/action";
            HttpPost http = new HttpPost(address);
            List nameValuePairs = new ArrayList(5);
            String uuid = UUID.randomUUID().toString();
            nameValuePairs.add(new BasicNameValuePair("id", uuid));
            nameValuePairs.add(new BasicNameValuePair("quantity", "1"));
            nameValuePairs.add(new BasicNameValuePair("type", "1"));
            nameValuePairs.add(new BasicNameValuePair("barCode", barcodeStr[0]));
            SimpleDateFormat formatUTC = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
            formatUTC.setTimeZone(TimeZone.getTimeZone("UTC"));
            nameValuePairs.add(new BasicNameValuePair("dateTime", formatUTC.format(new Date())));
            String response;
            try {
                http.setEntity(new UrlEncodedFormEntity(nameValuePairs));
            }
            catch (Exception ex){
                response = address + " -> " + ex.getMessage();
                return  response;
            }
            try {
                response = httpclient.execute(http, new BasicResponseHandler());
            }
            catch (Exception ex){
                response = address + " -> " + ex.getMessage();
            }
            return response;
        }
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
