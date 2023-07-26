#include <iostream>
#include <vector>
#include <map>

using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v;
    map<int, int> m;
    int i = 0;
    while(n--) {
        i++;
        int a;
        cin >> a;
        v.push_back(a);
        m[i] = a;
    }
    int t;
    cin >> t;
    int x = 1;
    while(t--) {
        x = m[x];
    }
    cout << x << endl;
}
