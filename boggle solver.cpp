#include<bits/stdc++.h>
using namespace std;
using namespace std::chrono;

struct Node{
	bool EOW;
	map<char, Node*> mp;
	
	Node(){EOW = false;}
};

class Game{
	Node* root;
	int rows, cols;
	bool** visited;
	vector<string> grid;
	
	void add_word(string s){
		Node* current = root;
		for(int i = 0; i < s.size(); i++){
			char c = s.at(i);
			if(current->mp[c] == NULL){
				Node* nn = new Node();
				current->mp[c] = nn;
			}
			current = current->mp[c];
		}
		current->EOW = true;
	}
	
	void dfs(Node* current, int row, int col, string& cword, unordered_map<string, int>& sol){
		if(row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]){return;}
		
		char c = grid[row][col];
		current = current->mp[c];
		
		if(current == NULL){return;}
		
		cword.push_back(c);
		
		if(current->EOW){++sol[cword];}
		
		visited[row][col] = 1;
		
		dfs(current, row+1, col+1, cword, sol);
		dfs(current, row+1, col-1, cword, sol);
		dfs(current, row+1, col, cword, sol);
		dfs(current, row, col+1, cword, sol);
		
		dfs(current, row-1, col-1, cword, sol);
		dfs(current, row-1, col+1, cword, sol);
		dfs(current, row-1, col, cword, sol);
		dfs(current, row, col-1, cword, sol);
		
		visited[row][col] = 0;
		
		cword.pop_back();
	}
	
	public:
		Game(const vector<string>& dic, const vector<string>& boggle){
			root = new Node();
			
			for(int i = 0; i < dic.size(); i++){
				add_word(dic.at(i));
			}
			this->grid = boggle;
			this->rows = boggle.size();
			this->cols = boggle[0].size();
			
			visited = new bool*[rows];
			for(int i = 0; i < rows; i++){
				visited[i] = new bool[cols];
				for(int j = 0; j < cols; j++){
					visited[i][j] = false;
				}
			}
		}
		
		void solve_boggle(){
			unordered_map<string, int> sol;
			
			for(int i = 0; i < rows; i++){
				for(int j = 0; j < cols; j++){
					string str;
					str.reserve(rows*cols);
					dfs(root, i, j, str, sol);
				}
			}
			
//			cout << "\n\nRESULTS:\n\n";
//			for(auto it = sol.begin(); it != sol.end(); it++){
//				cout << it->first << " -> " << it->second << "\n";
//			}
//			cout << "\n*****************************\n";
		}
		
		void display_grid(){
			for(int i = 0; i < rows; i++){
				for(int j = 0; j < cols; j++){
					cout << grid[i][j] << " ";
				}cout << "\n";
			}
		}
};

int main(){
		
	string str;
	ifstream fin("dictionary.txt");
	vector<string> dic;
	dic.reserve(100001);
	while(getline(fin, str)){
		if(dic.size() > 1000){break;}
		dic.push_back(str);
	}
	fin.close();
	
	fin.open("boggle.txt");
	vector<string> boggle;
	boggle.reserve(100001);
	
	while(getline(fin, str)){
		boggle.push_back(str);
	}
	
	Game g(dic, boggle);
	
//	cout << "GRID: \n\n";
//	g.display_grid();
	
	auto start = high_resolution_clock::now();
	
	g.solve_boggle();
	
	auto stop = high_resolution_clock::now();
	
	auto duration = duration_cast<microseconds>(stop - start);
  	
  	long double num = duration.count();
  	long double sec = num/(long double)1000;
  	
  	ofstream fout("stats.txt", ios:: app);
  	
  	fout << "TRIE SOLUTION: ";
    fout << fixed << setprecision(5) << sec << " milliseconds" << endl;
	
	fout.close();
	
	return 0;
}

/*


TIME: ((R*C)^8) + Length_of_dictionary * Average_word_length
=> ((R*C)^8) + 1000 * 6

SPACE: Length_of_dictionary * Average_word_length * Size_of_charset + R * C + Stack Size
=> 1000 * 6 * 26 + R*C + Stack Size

*/


