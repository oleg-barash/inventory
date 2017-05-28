package inventory.aeco.network.services;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import inventory.aeco.Configuration;
import inventory.aeco.network.models.ActionStatus;
import inventory.aeco.network.models.Item;
import inventory.aeco.network.models.LoginResult;
import inventory.aeco.network.models.LogoutResult;

/**
 * Created by Барашики on 27.05.2017.
 */

public class AuthService  {
    private List<AuthServiceListener> listeners = new ArrayList<AuthServiceListener>();
    private static final String TAG = "LoginService";
    private String baseUrl;
    private Context context;
    public AuthService(Context context){
        this.context = context;
        baseUrl = Configuration.BaseUrl + "user/";
    }

    public void AddListener(AuthServiceListener listener){
        listeners.add(listener);
    }

    public void Login(String username, String password){
        RequestQueue queue = Volley.newRequestQueue(this.context);
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("username", username);
        params.put("password", password);
        JsonObjectRequest jsonRequest = new JsonObjectRequest(baseUrl + "/login", new JSONObject(params),
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try{
                            ObjectMapper mapper = new ObjectMapper();
                            LoginResult loginResult = mapper.readValue(response.toString(), LoginResult.class);
                            BroadcastOnLogin(loginResult);
                        }
                        catch (IOException exception){
                            Log.e(TAG, "Error parsing login response: " + response.toString());
                            LoginResult loginResult = new LoginResult();
                            loginResult.Succeeded = false;
                            loginResult.Reason = "Сервер ответил неверным форматом";
                            BroadcastOnLogin(loginResult);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e(TAG, "Error login response: " + error.getMessage());
                LoginResult loginResult = new LoginResult();
                loginResult.Succeeded = false;
                loginResult.Reason = "Сервер вернул ошибку. Авторизация невозможна";
                BroadcastOnLogin(loginResult);
            }
        });
        jsonRequest.setRetryPolicy(new DefaultRetryPolicy(0, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(jsonRequest);
    }

    private void BroadcastOnLogin(LoginResult result){
        for(AuthServiceListener listener : listeners){
            if (listener != null){
                listener.OnLogin(result);
            }
        }
    }

    public interface AuthServiceListener{
        void OnLogin(LoginResult result);
        void OnLogout(LogoutResult result);
    }

}
