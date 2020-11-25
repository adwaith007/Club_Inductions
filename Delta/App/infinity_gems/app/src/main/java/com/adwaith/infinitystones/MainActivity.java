package com.adwaith.infinitystones;

import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity {
    String[] clrs = {"#800080", "#0000FF", "#00FF00", "#FF0000","#FF8C00", "#FFFF00"};
    String[] namelist = {"power","space","time","reality", "soul", "mind"};
    Integer[] state= {0,0,0,0,0,0} ;
    RelativeLayout rl;
    TextView msgbox;
    ArrayList<ImageView> boxes = new ArrayList<ImageView>();
    ArrayList<TextView> counters = new ArrayList<TextView>();
    String currentbg="#212121";
    SharedPreferences prefs;
    SharedPreferences.Editor edt;

    public void newgame()
    {
        Log.i("checkpoints", "3");
        Arrays.fill(state, 0);
        rl.setBackgroundColor(Color.parseColor("#212121"));
        currentbg="#212121";
        setcounters();
        Log.i("checkpoints", "3");
        msgbox.setText("PUNCH TO GET A GEM");
        Log.i("checkpoints", "4");
    }
    public void setcounters()
    {
        rl.setBackgroundColor(Color.parseColor(currentbg));
        for(Integer k=0;k<state.length;k++)
        {
            Log.i("state",String.valueOf(k));
            if(state[k]==0){
                boxes.get(k).setTranslationY(-1000f);
            }

        }
        for (Integer k=0; k<counters.size(); k++ )
        {
            counters.get(k).setText(String.valueOf(state[k]));
        }
    }
    public boolean checkfn()
    {
        for(Integer i:state)
        {
            if(i==0) {
                return false;
            }
        }
        return true;
    }
    public void getgem(View view) throws InterruptedException {
        Integer n = rand();
        if(state[n]==0) {
            boxes.get(n).animate().translationYBy(1000f).setDuration(200);
        }
        msgbox.setText("YOU GOT A "+namelist[n].toUpperCase()+" STONE");
        rl.setBackgroundColor(Color.parseColor(clrs[n]));
        currentbg=clrs[n];
        state[n]+=1;
        counters.get(n).setText(String.valueOf(state[n]));

        if(checkfn())
        {
            AlertDialog.Builder abuilder = new AlertDialog.Builder(MainActivity.this);
            abuilder.setMessage("You got them all. Check out www.tamilrockers.li for full movie ;p").setCancelable(false)
            .setPositiveButton("Play Again", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    newgame();
                }
            })
            .setNegativeButton("Exit App!", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    newgame();
                    finish();
                }
            });
            AlertDialog alert = abuilder.create();
            alert.show();
        }

    }
//    public void imagesetup(){
//        for(Integer i: state){
//            if(state[i]!=0){
//                boxes.get(i).setTranslationY(1000f);
//            }
//        }
//
////    }

    public Integer rand(){
        Random rnd = new Random();
        Integer n = rnd.nextInt(6);
        return n;
    }
    public void nwgame(View view){
        newgame();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.i("checkpoints", "start");
        boxes.add((ImageView) findViewById(R.id.v0));
        boxes.add((ImageView) findViewById(R.id.v1));
        boxes.add((ImageView) findViewById(R.id.v2));
        boxes.add((ImageView) findViewById(R.id.v3));
        boxes.add((ImageView) findViewById(R.id.v4));
        boxes.add((ImageView) findViewById(R.id.v5));


        Log.i("checkpoints", "1");
        counters.add((TextView) findViewById(R.id.c0));
        counters.add((TextView) findViewById(R.id.c1));
        counters.add((TextView) findViewById(R.id.c2));
        counters.add((TextView) findViewById(R.id.c3));
        counters.add((TextView) findViewById(R.id.c4));
        counters.add((TextView) findViewById(R.id.c5));

        msgbox = (TextView) findViewById(R.id.msgbox);
        rl = (RelativeLayout) findViewById(R.id.rl);
        Log.i("checkpoints", "2");
        prefs = getSharedPreferences("com.adwaith.infinitystones", Context.MODE_PRIVATE);
        edt=prefs.edit();
        for(Integer i=0;i<6;i++){
            state[i]=prefs.getInt(String.valueOf(i),0);
        }
        currentbg=prefs.getString("currentbg","#212121");
        Log.i("pref", currentbg);
        setcounters();

    }

    @Override
    protected void onPause() {
        super.onPause();
        for(Integer i=0; i<6;i++){
            edt.putInt(String.valueOf(i),state[i]);
        }
        edt.putString("currentbg", currentbg);
        edt.commit();
    }
}
