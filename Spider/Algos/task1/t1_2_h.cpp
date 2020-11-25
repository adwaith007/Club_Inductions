// enter input in this format
// currentfloor  no_of_ppl_in_lift_now  capacity
//floor_number ppl_entering ppl_leaving floor_number ppl_entering ppl_leaving floor_number ppl_entering ppl_leaving...
#include <bits/stdc++.h>
using namespace std;
class flr{
public:
    int n, enter, leave;
   /* floor(int a,int b,int c){
        n=a;
        enter=b;
        leave=c;
    }*/
};
struct pred {
    bool operator()(flr const & a, flr const & b) const {
        return a.n < b.n;
    }
};


int main(){

    vector <flr> a,b;
    int cf,tfloor,tin,tout,d=0,capacity,cp,flag=1;
    flr temp;
    cin>>cf>>cp>>capacity;
    do{
        cin>>temp.n>>temp.enter>>temp.leave;
        if(temp.n>cf)
            a.push_back(temp);
        else
            b.push_back(temp);
    }while(cin&&cin.peek()!='\n');
    sort(a.begin(),a.end(),pred());
    cout<<cf<<" ";
    for(int i=0;i<a.size();i++){
        if((cp+a[i].enter-a[i].leave)>capacity||(cp+a[i].enter-a[i].leave)<0){
            b.push_back(a[i]);
        }
        else{
            cout<<a[i].n<<" ";
            cp+=a[i].enter-a[i].leave;
            d+=abs(cf-a[i].n);
            cf=a[i].n;
        }
    }
    sort(b.begin(),b.end(),pred());
    for(int i=b.size()-1;i>=0;i--){
        if((cp+b[i].enter-b[i].leave)>capacity||(cp+b[i].enter-b[i].leave)<0){
            //clear current line here
            cout<<"IMPOSSIBLE";
            flag=0;
        }
        else{
            cout<<b[i].n<<" ";
            cp+=b[i].enter-b[i].leave;
            d+=abs(cf-b[i].n);
            cf=b[i].n;
        }
    }
    if(flag){
        cout<<endl<<"TOTAL DISTANCE:"<<d;
    }




}
