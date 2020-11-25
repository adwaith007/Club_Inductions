#include<bits/stdc++.h>
using namespace std;

struct node{
int val;
node* branches;
};
char baseimg[100][100];
int finalimg[100][100];
float computer(int x1, int y1, int dim){
    int counter=0,j;
    for(int i=0;i<dim;i++){
        for(j=0;j<dim;j++){
            if(baseimg[y1+i][x1+j]=='1'){
                counter++;
            }
        }
    }
    return ((float)counter)/(dim*dim);
}

void treebuilder(node* root, int x1, int y1, int dim,float thresh){
    float t=computer(x1,y1,dim);
    if(t>=thresh){
        root->val=1;
    }
    else if(t<=1-thresh){
        root->val=0;
    }
    else{
        root->val=-1;
        root->branches= new node[4];
        treebuilder(root->branches,x1+dim/2,y1,dim/2,thresh);
        treebuilder(root->branches+1,x1,y1,dim/2,thresh);
        treebuilder(root->branches+2,x1,y1+dim/2,dim/2,thresh);
        treebuilder(root->branches+3,x1+dim/2,y1+dim/2,dim/2,thresh);
    }

}

void imagereader(node* root, int x1, int y1,int dim){
    int i,j;
    if(root->val!=-1){
        for(i=0;i<dim;i++){
            for(j=0;j<dim;j++){
                finalimg[y1+i][x1+j]=root->val;
            }
        }
    }
    else{
        imagereader(root->branches,x1+dim/2,y1,dim/2);
        imagereader(root->branches+1,x1,y1,dim/2);
        imagereader(root->branches+2,x1,y1+dim/2,dim/2);
        imagereader(root->branches+3,x1+dim/2,y1+dim/2,dim/2);
    }
}


int main(){

    int n,i,j,c=1,t;
    while(1){
        cin>>n;
        if(n==0){
            break;
        }
        cin>>t;
        for(i=0;i<n;i++){
            for(j=0;j<n;j++){
                cin>>baseimg[i][j];
            }
        }
        node* imgtree= new node;
        treebuilder(imgtree,0,0,n,((float)t)/100);
        imagereader(imgtree,0,0,n);
        cout<<"Image "<<c<<":"<<endl;
        c++;
       for(i=0;i<n;i++){
            for(j=0;j<n;j++){
                cout<<finalimg[i][j];
            }
            cout<<endl;
        }
    }
}
