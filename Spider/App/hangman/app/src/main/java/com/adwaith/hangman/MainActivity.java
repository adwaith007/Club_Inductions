package com.adwaith.hangman;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;


import java.util.ArrayList;
import java.util.Random;

import static java.lang.Character.toUpperCase;

public class MainActivity extends AppCompatActivity {
    String lib[]={"AWKWARD","BAGPIPES","BANJO","BUNGLER", "CROQUET", "DWARVES", "FERVID","CRYPT","FISHBOOK", "GAZEBO","GYPSY","HAIKU",
    "HAPHAZARD","HYPHEN", "IVORY","JAZZY","JIFFY","JINX","JUKEBOX","KAYAK"};
    String curtxt, reftxt;
    int n,wrongcount=0,bestc;
    TextView dbox,bestw,currentw;
    EditText inputchar;
    ArrayList<ImageView> images= new ArrayList<ImageView>();
    SharedPreferences prefs;
    SharedPreferences.Editor edt;

    protected void newgame(){
        Log.i("checkpoint","3");
        bestc=prefs.getInt("best",7);
        bestw.setText("Best: "+bestc+" wrong(s)");
        wrongcount=0;
        for(int i=0;i<images.size();i++){
            images.get(i).setTranslationY(-1000f);
        }
        Random rand = new Random();
        n=rand.nextInt(lib.length);
        reftxt=lib[n];
        curtxt="";
        for(int i=0;i<reftxt.length();i++){
            curtxt+="_";
            dbox.setText(maketext(curtxt));
        }
        Log.i("checkpoint","4");

    }

    protected void guesschar(View v){
        boolean flag=false;
        char input=toUpperCase(inputchar.getText().toString().charAt(0));
        inputchar.setText("");
        StringBuilder temp= new StringBuilder(curtxt);
        for(int i=0;i<reftxt.length();i++){
            if(reftxt.charAt(i)==input){
                temp.setCharAt(i,input);
                flag=true;
            }
        }
        curtxt=temp.toString();
        dbox.setText(maketext(curtxt));
        if(!flag){
            gonewrong();
        }
        else{
            checkwin();
        }


    }

    protected String maketext(String ip){
        String op;
        op="";
        for(int i=0;i<ip.length();i++){
            op+=ip.charAt(i)+" ";
        }
        return op;
    }
    protected void checkwin(){
        boolean win=true;
        for(int i=0;i<curtxt.length();i++){
            if(curtxt.charAt(i)=='_'){
                win=false;
            }
        }
        if(win){
            if(wrongcount<bestc){
                edt.putInt("best", wrongcount);
                edt.commit();
            }
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
            alertDialogBuilder.setMessage("You, saved him. Wanna Play Again??").setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    newgame();
                }
            }).setNegativeButton("No", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    finish();
                }
            }).setCancelable(false).show();
        }
    }

    protected void gonewrong(){
        images.get(wrongcount).animate().translationYBy(1000f).setDuration(2000);
        wrongcount++;
        currentw.setText("Now: "+wrongcount+" wrong(s)");
        if(wrongcount==7){
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
            alertDialogBuilder.setMessage("You, killed him. Wanna Play Again??").setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    newgame();
                }
            }).setNegativeButton("No", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    finish();
                }
            }).setCancelable(false).show();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.i("checkpoint","1");
        dbox=(TextView)findViewById(R.id.dbox);
        bestw=(TextView)findViewById(R.id.bestw);
        currentw=(TextView)findViewById(R.id.currentw);
        inputchar=(EditText)findViewById((R.id.inputchar));
        images.add((ImageView) findViewById(R.id.head));
        images.add((ImageView) findViewById(R.id.eye));
        images.add((ImageView) findViewById(R.id.body));
        images.add((ImageView) findViewById(R.id.leftarm));
        images.add((ImageView) findViewById(R.id.rightarm));
        images.add((ImageView) findViewById(R.id.leftleg));
        images.add((ImageView) findViewById(R.id.rightleg));
        prefs=getSharedPreferences("com.adwaith.hangman", Context.MODE_PRIVATE);
        edt=prefs.edit();
        bestc=prefs.getInt("best",7);
        bestw.setText("Best: "+bestc+" wrong(s)");
        Log.i("checkpoint","2");
        newgame();

    }
}
