Adwaith D 106117007
#include<iostream.h>

int main()
{
	int a =[32,13,64,24,75,14,85,97,43,11],t,j;

	cout<<"Before sort\n";
	for(i=0;i<10;i++)
	{
		cout<<a[i]<<" ";
	}
	cout<<endl;
	
	for(int i=0;i<9;i++)
	{
		for( j=0;j<9-i;j++)
		{
			if(j[i]>j[i+1])
			{
				t=j[i];
				j[i]=j[i+1];
				j[i+1]=t;
			}
		}
	}

	cout<<"After sort\n";
	for(i=0;i<10;i++)
	{
		cout<<a[i]<<" ";
	}
	cout<<endl;
	
	return 0;
}
