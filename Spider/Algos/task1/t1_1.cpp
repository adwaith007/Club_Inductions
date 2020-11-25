#include <bits/stdc++.h>
using namespace std;

char mapper (char a, int key){
    int b= (int) a, c;

    if(b>=65&&b<=90){
            c=b-65;
            c=(c+key)%26;
            c+=65;
            return (char)c;

    }
    else if(b>=97&&b<=122){
            c=b-97;
            c=(c+key)%26;
            c+=97;
            return (char)c;
    }
    else{
        return a;
    }
}

void encrypt(string a, int key, int n){
    cout<<"ciphertext#"<<n<<":";
    for(int i=0;i<a.size();i++){
            cout<<mapper(a.at(i), key);

    }
    cout<<endl;
}
void decrypt(string a, int key, int n){
    cout<<"plaintext#"<<n<<":";
    for(int i=0;i<a.size();i++){
            cout<<mapper(a.at(i),26-key%26);

    }
    cout<<endl;
}

int main(){
    int n, key;
    string txt;
    cin>>n>>key;
    for(int i=1;i<=n;i++){
        cin>>txt;
        encrypt(txt,key,i);
    }
    for(int i=1;i<=n;i++){
        cin>>txt;
        decrypt(txt,key,i);
    }


}
