#include <bits/stdc++.h>
using namespace std;


// A Tree node
struct Node
{
	char ch;
	int freq;
	Node *left, *right;
};

// Function to allocate a new tree node
Node* getNode(char ch, int freq, Node* left, Node* right)
{
	Node* node = new Node();

	node->ch = ch;
	node->freq = freq;
	node->left = left;
	node->right = right;

	return node;
}

struct comp
{
	bool operator()(Node* l, Node* r)
	{
		// highest priority item has lowest frequency
		return l->freq > r->freq;
	}
};


void encode(Node* root, string str,
			unordered_map<char, string> &huffmanCode)
{
	if (root == nullptr)
		return;

	if (!root->left && !root->right) {
		huffmanCode[root->ch] = str;
	}

	encode(root->left, str + "0", huffmanCode);
	encode(root->right, str + "1", huffmanCode);
}

void decode(Node* root, int &index, string str)
{
	if (root == nullptr) {
		return;
	}

	// found a leaf node
	if (!root->left && !root->right)
	{
		cout << root->ch;
		return;
	}

	index++;

	if (str[index] =='0')
		decode(root->left, index, str);
	else
		decode(root->right, index, str);
}

void buildHuffmanTree(string text)
{
   
    unordered_map<char, int> freq;
    for (char ch: text) {
        freq[ch]++;
    }

   
    priority_queue<Node*, vector<Node*>, comp> pq;

    
    for (auto pair: freq) {
        pq.push(getNode(pair.first, pair.second, nullptr, nullptr));
    }

    while (pq.size() != 1)
    {
      
        Node *left = pq.top(); pq.pop();
        Node *right = pq.top(); pq.pop();

      
        int sum = left->freq + right->freq;
        pq.push(getNode('\0', sum, left, right));
    }

    Node* root = pq.top();
    unordered_map<char, string> huffmanCode;
    encode(root, "", huffmanCode);

    cout << "Huffman Codes are :\n" << '\n';
    for (auto pair: huffmanCode) {
        cout << pair.first << " " << pair.second << '\n';
    }

    cout << "\nOriginal string was :\n" << text << '\n';

    string encodedStr = "";
    for (char ch: text) {
        encodedStr += huffmanCode[ch];
    }

    int padding = 8 - (encodedStr.length() % 8);
    for (int i = 0; i < padding; ++i) {
        encodedStr += '0';
    }

    cout << "\nEncoded string is :\n" << encodedStr << '\n';
    ofstream outFile("../file-uploader-downloader-master/api/downloads/newfile.txt", ios::binary);
    for (size_t i = 0; i < encodedStr.length(); i += 8) {
        string byte = encodedStr.substr(i, 8);
        bitset<8> bits(byte);
        outFile << char(bits.to_ulong());
    }
    outFile.close();

    int index = -1;
    cout << "\nDecoded string is: \n";
    while (index < (int)encodedStr.size() - 2) {
        decode(root, index, encodedStr);
    }
}

int main()
{
    fstream f;
	string txt;
    f.open("../file-uploader-downloader-master/api/uploads/old.txt",ios::in);
    if(f.is_open())
    {
        string tp;
        while(getline(f,tp))
        {
            txt+=tp;
        }
        f.close();
    }
    buildHuffmanTree(txt);
    return 0;
}
