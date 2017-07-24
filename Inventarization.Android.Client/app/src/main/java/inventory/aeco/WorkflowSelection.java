package inventory.aeco;

import android.content.Intent;
import android.os.Bundle;
import android.app.Activity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.RadioButton;

import inventory.R;

public class WorkflowSelection extends Activity {
    private ActionType selectedActionType = ActionType.FirstScan;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_workflow_selection);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        Log.i("key pressed", String.valueOf(event.getKeyCode()));
        if (event.getKeyCode() == KeyEvent.KEYCODE_ENTER){
            Intent intent = new Intent(WorkflowSelection.this, ZoneSelectActivity.class);
            intent.putExtra(ZoneSelectActivity.ACTION_TYPE_MESSAGE, selectedActionType.toString());
            startActivity(intent);
            return false;
        }
        return super.dispatchKeyEvent(event);
    }

    public void onOkButtonClicked(View view){
        Intent intent = new Intent(WorkflowSelection.this, ZoneSelectActivity.class);
        intent.putExtra(ZoneSelectActivity.ACTION_TYPE_MESSAGE, selectedActionType.toString());
        startActivity(intent);
    }

    public void onTypeButtonClicked(View view){
        Intent intent = new Intent(WorkflowSelection.this, ZoneSelectActivity.class);
        switch(view.getId()) {
            case R.id.firstScan:
                intent.putExtra(ZoneSelectActivity.ACTION_TYPE_MESSAGE, ActionType.FirstScan.toString());
                break;
            case R.id.secondScan:
                intent.putExtra(ZoneSelectActivity.ACTION_TYPE_MESSAGE, ActionType.SecondScan.toString());
                break;
            case R.id.blindScan:
                intent.putExtra(ZoneSelectActivity.ACTION_TYPE_MESSAGE, ActionType.BlindScan.toString());
                break;
        }

        startActivity(intent);
    }

    public void onRadioButtonClicked(View view) {
        // Is the button now checked?

        boolean checked = ((RadioButton) view).isChecked();

        // Check which radio button was clicked
        switch(view.getId()) {
            case R.id.firstScan:
                if (checked)
                    selectedActionType = ActionType.FirstScan;
                    break;
            case R.id.secondScan:
                if (checked)
                    selectedActionType = ActionType.SecondScan;
                    break;
            case R.id.blindScan:
                if (checked)
                    selectedActionType = ActionType.BlindScan;
                break;
        }
    }

}
