package com.adwaith.rubictimer;

import android.animation.ArgbEvaluator;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.media.MediaPlayer;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.SystemClock;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    TextView insptime;
    TextView tottime;
    RelativeLayout rl ;
    int state=0;
    Handler handler;
    Runnable run;
    long timeelapsed=0;
    CountDownTimer ctimer;
    MediaPlayer mplayer,mplayer2;
    ObjectAnimator backgroundColorAnimator;
    long StartTime;

    public void startwatch(){
        handler = new Handler();
        StartTime = SystemClock.uptimeMillis();
        run = new Runnable() {
            @Override
            public void run() {
                timeelapsed=SystemClock.uptimeMillis()-StartTime;
                long minutes = timeelapsed/60000;
                long seconds = (timeelapsed- minutes*60000)/1000;
                long millis= timeelapsed - minutes*60000 - seconds*1000;
                String timetot= String.format("%02d:%02d:%02d",minutes,seconds,millis/10);
                tottime.setText(timetot);
                handler.postDelayed(this,10);

            }
        };
        handler.post(run);
    }
    public void ctrl(View v){
        timectrl();
    }
    public void timectrl(){
        if(state==0){
            backgroundColorAnimator = ObjectAnimator.ofObject(rl,
                    "backgroundColor",
                    new ArgbEvaluator(),
                    0xff5cb85c,
                    0xffd9534f);
            backgroundColorAnimator.setDuration(15000);
            backgroundColorAnimator.start();
            state=1;
            ctimer = new CountDownTimer(15000, 10) {
                @Override
                public void onTick(long millisUntilFinished) {
                    long seconds = millisUntilFinished/1000;
                    long millis = millisUntilFinished%1000;
                    String timeleft = String.format("%02d:%02d", seconds, millis/10);
                    insptime.setText(timeleft);
                    if(millisUntilFinished<=3000){
                        mplayer.start();
                    }


                }

                @Override
                public void onFinish() {
                    mplayer.stop();
                    mplayer2.start();
                    state=2;
                    insptime.setText("00:00");
                    startwatch();
                }
            }.start();
        }
        else if(state==1){
            state=2;
            mplayer2.start();
            ColorDrawable temp1= (ColorDrawable) rl.getBackground();
            int color=temp1.getColor();
            backgroundColorAnimator.cancel();
            rl.setBackgroundColor(color);
            ctimer.cancel();
            startwatch();
        }
        else if(state==2){
            state=3;
            handler.removeCallbacks(run);
        }
        else if(state==3){
            mplayer2.stop();
            mplayer.stop();
            state=0;
            insptime.setText("15:00");
            tottime.setText("00:00:00");
            rl.setBackgroundColor(Color.parseColor("#5cb85c"));
        }
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        insptime=(TextView) findViewById(R.id.insptime);
        tottime=(TextView) findViewById(R.id.tottime);
        rl =(RelativeLayout) findViewById(R.id.rl);
        mplayer = MediaPlayer.create(getApplicationContext(),R.raw.beep);
        mplayer2 = MediaPlayer.create(getApplicationContext(),R.raw.horn);

    }

    @Override
    protected void onPause() {
        super.onPause();
        try {
            ctimer.cancel();
            handler.removeCallbacks(run);
            mplayer2.stop();
            mplayer.stop();
        }
        catch (Exception e){
            e.printStackTrace();
        }

        state=0;
        insptime.setText("15:00");
        tottime.setText("00:00:00");
        rl.setBackgroundColor(Color.parseColor("#5cb85c"));
    }
}
