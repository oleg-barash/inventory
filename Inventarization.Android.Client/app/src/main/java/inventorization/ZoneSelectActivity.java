package inventorization;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.device.ScanManager;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.os.Vibrator;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ZoneSelectActivity extends Activity {

    private final static String SCAN_ACTION = "urovo.rcv.message";
    private boolean isScaning = false;
    private Vibrator mVibrator;
    private ScanManager mScanManager;
    private SoundPool soundpool = null;
    private int soundid;
    private String barcodeStr;
    private Button okButton;
    private EditText showScanResult;
    private TextView resultTextView;
    private Zone zone;

    private void initScan() {
        // TODO Auto-generated method stub
        mScanManager = new ScanManager();
        mScanManager.openScanner();

        mScanManager.switchOutputMode( 0);
        soundpool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 100); // MODE_RINGTONE
        soundid = soundpool.load("/etc/Scan_new.ogg", 1);
    }

    private class ZoneDownloader extends AsyncTask<String, Void, String> {

        protected String doInBackground(String... barcodeStr) {
            HttpClient httpclient = new DefaultHttpClient();
            String address = "http://192.168.0.106/api/zone?code=" + barcodeStr[0];
            HttpGet http = new HttpGet(address);
            String response;
            try {
                response = httpclient.execute(http, new BasicResponseHandler());
            }
            catch (Exception ex){
                response = address + " -> " + ex.getMessage();
            }
            return response;
        }
    }

    private void setupView() {
        // TODO Auto-generated method stub
        showScanResult = (EditText) findViewById(R.id.scan_result);
        resultTextView = (TextView) findViewById(R.id.resultTextView);
        okButton = (Button) findViewById(R.id.okButton);
        okButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                if(barcodeStr != null && !barcodeStr.isEmpty()) {
                    Intent intent = new Intent(ZoneSelectActivity.this, MainActivity.class);
                    intent.putExtra(MainActivity.ZONE_MESSAGE, zone.Id);
                    startActivity(intent);
                }
            }
        });
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
            //byte[] barcode = intent.getByteArrayExtra("barcode");
            int barocodelen = intent.getIntExtra("length", 0);
            byte temp = intent.getByteExtra("barcodeType", (byte) 0);
            android.util.Log.i("debug", "----codetype--" + temp);
            barcodeStr = new String(barcode, 0, barocodelen);

            showScanResult.setText(barcodeStr);

            try {
                ObjectMapper mapper = new ObjectMapper();
                String res = new ZoneDownloader().execute(barcodeStr).get();
                zone = mapper.readValue(res, Zone.class);
                resultTextView.setText(zone.Name);
            }
            catch (Exception ex){
                resultTextView.setText(ex.getMessage());
            }
        }

    };

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
