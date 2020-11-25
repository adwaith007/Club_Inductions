#include <bits/stdc++.h>
using namespace std;



int main(){

    vector <int> a,b;
    int cf,t;
    cin>>cf;
    do{
        cin>>t;
        if(t>cf)
            a.push_back(t);
        else
            b.push_back(t);
    }while(cin&&cin.peek()!='\n');
    t=0;
    cout<<cf<<" ";
    sort(a.begin(),a.end());
    sort(b.begin(),b.end());
    for(int i=0;i<a.size();i++){
        cout<<a[i]<<" ";
        t+=abs(a[i]-cf);
        cf=a[i];
    }
    for(int i=b.size()-1;i>=0;i--){
        cout<<b[i]<<" ";
        t+=abs(b[i]-cf);
        cf=b[i];
    }
    cout<<endl<<"Total Distance: "<<t;



}
