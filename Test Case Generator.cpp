#include<bits/stdc++.h>
using namespace std;
#define ll long long
#define ld long double
#define FAST ios::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);
#define mpr make_pair
#define pb push_back
#define pp pair<ll, ll>
#define ff first
#define ss second
#define yes cout<<"YES\n";
#define no cout<<"NO\n";
const ll MAX = 2*1e5 + 1;
ll M = 1e9 + 7;



int main(){
	srand(time(0));
	
	int n; cin >> n;
	int m; cin >> m;
	
	ofstream fout("boggle.txt");
	for(int i = 0; i < n; i++){
		for(int j = 0; j < m; j++){
			int x = rand()%26;
			char c = (char)(x + 'a');
			fout << c;
		}
		fout << endl;
	}
	fout.close();
	
	fout.open("stats.txt", ios::app);
	fout << "\n\nTEST CASE:" << endl;
	fout << "BOGGLE DIMENSIONS: " << n << " X " << m << endl;
	fout.close();	
	
	return 0;
}

/*








*/


