#include<bits/stdc++.h>
using namespace std;
//data structures
struct arraywrapper{
    char val[100];
};
struct operation{
    int type;
    char str[100];
};
struct node{
    char value;
    int isend;
    node *ptr[53];
};

class word{
public:
    char a[100];
    int frequency;
    bool operator<(const word &rhs) const {
        if(frequency!=rhs.frequency){
            return frequency>rhs.frequency;
        }
        else{
            return strcmp(a,rhs.a)<0;
        }
    }
};
vector<word> words;
//utility functions
int mapper(char c){
    if(c==' '){
        return 52;
    }
    else if(islower(c)) {
        return c-'a';
    }
    else if(isupper(c)){
        return c-'A'+26;
    }
}

//
node* createnode(){
    node *newnode = new node();
    for(int i=0;i<53;i++){
        newnode->ptr[i]=NULL;
    }
    newnode->isend=0;
    newnode->value='\0';
    return newnode;
}

void addtrie(char s[], node* root){
    int i=0;
    node* currnode= root;
    while(i<strlen(s)){
        if(currnode->ptr[mapper(s[i])]!=NULL){
            currnode=currnode->ptr[mapper(s[i])];
            i++;
        }
        else{
            currnode->ptr[mapper(s[i])]= createnode();
            currnode->ptr[mapper(s[i])]->value=s[i];
            currnode=currnode->ptr[mapper(s[i])];
            i++;
        }
    }
    currnode->isend++;
}
//
bool haschild(node* root){
   bool hs=false;
   for(int i=0;i<53;i++){
    if(root->ptr[i]!=NULL){
        hs=true;
    }
   }
   return hs;
}
bool deletetrie(char s[], node* root){
    if(strlen(s)==0){
        root->isend=0;
        if(!haschild(root)){
            delete root;
            return true;
        }
        else{
            return false;
        }
    }
    else{
        if(deletetrie(s+1, root->ptr[mapper(s[0])])){
            root->ptr[mapper(s[0])]=NULL;
            if(!haschild(root)&&!root->isend){
                delete root;
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

}



//
void findallwords(arraywrapper t, node* root){
    int l=strlen(t.val);
    t.val[l]=root->value;
    t.val[l+1]='\0';
    //puts(t);

    for(int i=0;i<53;i++){
        if(root->ptr[i]!=NULL){
            findallwords(t,root->ptr[i]);
        }
    }

    if(root->isend>0){
        word w;
        strcpy(w.a,t.val);
        w.frequency=root->isend;
        words.push_back(w);
    }
}

void findintrie(char s[], node* root){
    int i=0;
    node* currnode=root;
    while(i<strlen(s)){
            currnode=currnode->ptr[mapper(s[i])];
            i++;
    }
    words.clear();
    arraywrapper t;
    strcpy(t.val,s);
    for(i=0;i<53;i++){
        if(currnode->ptr[i]!=NULL){
            findallwords(t,currnode->ptr[i]);
        }
    }
}





int main(){
    int n,j,ocount=0,x;
    stack<operation> operations;
    operation tempo;
    cin>>n;
    char temp[100], tempstr[100];
    cin.ignore(numeric_limits<streamsize>::max(),'\n');
    node* root= createnode();
    for(int i=0;i<n;i++){
        cin.getline(temp,100);
        addtrie(temp, root);
    }
    cin>>n;
    for(int i=0;i<n;i++){
        cin>>temp;
        cin.ignore(numeric_limits<streamsize>::max(),' ');
        //cout<<"****"<<tempstr<<"***";
        if(!strcmp(temp,"add")){
            cin.getline(tempstr,100);
            tempo.type=1;
            strcpy(tempo.str,tempstr);
            operations.push(tempo);
            ocount++;
            addtrie(tempstr, root);
        }
        else if(!strcmp(temp, "remove")){
            cin.getline(tempstr,100);
            tempo.type=2;
            strcpy(tempo.str,tempstr);
            operations.push(tempo);
            ocount++;
            deletetrie(tempstr,root);
        }
        else if(!strcmp(temp, "query")){
            cin.getline(tempstr,100);
            findintrie(tempstr, root);
            sort(words.begin(),words.end());
            for(j=0;j<min(5,(int)words.size());j++){
                puts(words[j].a);
                cout<<words[j].frequency<<endl;
            }
        }
        else if(!strcmp(temp,"revert")){
            cin>>x;
            while(ocount>x){
                tempo.type=operations.top().type;
                strcpy(tempo.str,operations.top().str);
                if(tempo.type==1){
                    deletetrie(tempo.str,root);
                }
                else if(tempo.type==2){
                    addtrie(tempo.str,root);
                }
                ocount--;
            }
        }
    }
}
