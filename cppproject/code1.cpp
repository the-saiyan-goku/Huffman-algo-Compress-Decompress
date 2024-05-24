#include <bits/stdc++.h>
using namespace std;

// A Tree node
struct Node {
    char ch;
    int freq;
    Node *left, *right;
};

// Define the comparison structure comp
struct comp {
    bool operator()(Node *l, Node *r) {
        // highest priority item has lowest frequency
        return l->freq > r->freq;
    }
};

// Function to allocate a new tree node
Node *getNode(char ch, int freq, Node *left, Node *right) {
    Node *node = new Node();

    node->ch = ch;
    node->freq = freq;
    node->left = left;
    node->right = right;

    return node;
}

void decode(Node *root, int &index, string str, ofstream &outFile) {
    if (root == nullptr) {
        return;
    }

    // found a leaf node
    if (!root->left && !root->right) {
        outFile << root->ch;
        return;
    }

    index++;

    if (str[index] == '0')
        decode(root->left, index, str, outFile);
    else
        decode(root->right, index, str, outFile);
}

void decompressHuffmanFile(string compressedFile, string outputFile, Node *root) {
    ifstream inFile(compressedFile, ios::binary);
    ofstream outFile(outputFile);

    string encodedStr = "";
    char ch;
    while (inFile.get(ch)) {
        encodedStr += bitset<8>(ch).to_string();
    }
    inFile.close();

    int index = -1;
    while (index < (int)encodedStr.size() - 2) {
        decode(root, index, encodedStr, outFile);
    }

    outFile.close();
}

int main() {
    ifstream codeFile("../file-uploader-downloader-master/api/downloads/newfile.txt", ios::binary);
    string compressedFile = "../file-uploader-downloader-master/api/downloads/newfile.txt";
    string outputFile = "../file-uploader-downloader-master/api/downloads/decodedFile.txt";

    unordered_map<char, int> freq;
    char ch;
    while (codeFile.get(ch)) {
        freq[ch]++;
    }
    codeFile.close();

    priority_queue<Node *, vector<Node *>, comp> pq;
    for (auto pair : freq) {
        pq.push(getNode(pair.first, pair.second, nullptr, nullptr));
    }

    while (pq.size() != 1) {
        Node *left = pq.top();
        pq.pop();
        Node *right = pq.top();
        pq.pop();

        int sum = left->freq + right->freq;
        pq.push(getNode('\0', sum, left, right));
    }

    Node *root = pq.top();

    decompressHuffmanFile(compressedFile, outputFile, root);

    cout << "Decompressed file saved as decodedFile.txt\n";

    return 0;
}
