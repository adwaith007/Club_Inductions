package com.adwaith.payThePiper;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Random;

public class MainActivity extends AppCompatActivity {
    TextView curamt;
    TextView totamt;
    RelativeLayout r1;
    String currentbg;
    Random rand = new Random();
    Integer tot, cur;
    SharedPreferences prefs;
    SharedPreferences.Editor edt;
    public void settext(String s, TextView t){
        t.setText(s);
    }
    public void set5 (View view)
    {
        Integer n= Integer.parseInt(curamt.getText().toString());
        n=n+5;
        settext(String.valueOf(n), curamt);
        chk();
    }
    public void set1 (View view)
    {
        Integer n= Integer.parseInt(curamt.getText().toString());
        n=n+1;
        settext(String.valueOf(n), curamt);
        chk();
    }
    public void set2 (View view)
    {
        Integer n= Integer.parseInt(curamt.getText().toString());
        n=n+2;
        settext(String.valueOf(n), curamt);
        chk();
    }
    public void set10 (View view)
    {
        Integer n= Integer.parseInt(curamt.getText().toString());
        n=n+10;
        settext(String.valueOf(n), curamt);
        chk();
    }
    public void reset(View view){
        settext(String.valueOf(0), curamt);
        r1.setBackgroundColor(Color.parseColor("#212121"));
        currentbg="#212121";
    }
    public void newgame(View view){
        tot= rand.nextInt(100) +1;
        cur=0;
        currentbg="#212121";
        setup();
    }
    public void chk ()
    {
        if(Integer.parseInt(curamt.getText().toString())>Integer.parseInt(totamt.getText().toString()))
        {
            r1.setBackgroundColor(Color.parseColor("#dc3545"));
            currentbg="#dc3545";
            Toast.makeText(getApplicationContext(),"Exceeded", Toast.LENGTH_SHORT).show();
        }
        else if(Integer.parseInt(curamt.getText().toString())==Integer.parseInt(totamt.getText().toString())){
            r1.setBackgroundColor(Color.parseColor("#28a745"));
            currentbg="#28a745";
            Toast.makeText(getApplicationContext(),"You Win", Toast.LENGTH_SHORT).show();
        }
    }
    public void setup(){
        r1.setBackgroundColor(Color.parseColor(currentbg));
        settext(String.valueOf(tot), totamt);
        settext(String.valueOf(cur), curamt);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {



        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        prefs = getSharedPreferences("com.adwaith.payThePiper", Context.MODE_PRIVATE);
        edt = prefs.edit();
        curamt =(TextView) findViewById(R.id.curamt);
        totamt =(TextView) findViewById(R.id.totamt);
        r1 = (RelativeLayout)findViewById(R.id.rlayout1);
        cur = prefs.getInt("cur",0);
        tot = prefs.getInt("tot", rand.nextInt(100)+1);
        currentbg = prefs.getString("currentbg", "#212121");
        setup();



    }

    @Override
    protected void onPause() {
        super.onPause();
        edt.putString("currentbg", currentbg);
        edt.putInt("cur", Integer.valueOf(curamt.getText().toString()));
        edt.putInt("tot", Integer.valueOf(totamt.getText().toString()));
        edt.commit();
    }
}
