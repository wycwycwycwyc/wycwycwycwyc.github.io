#include <iostream>
#include <vector>
#include <algorithm >
#include <chrono>
#include <fstream>
#include <sstream>
using namespace std;
using namespace std::chrono;
void merge(vector& arr, int left, int mid, int right, bool ascending);
int partition(vector& arr, int low, int high, bool ascending);
// 快速排序
void quickSort(vector& arr, int low, int high, bool ascending) {
    if (low < high) {
        int pivot = partition(arr, low, high, ascending);
        quickSort(arr, low, pivot - 1, ascending);
        quickSort(arr, pivot + 1, high, ascending);
    }
}

int partition(vector& arr, int low, int high, bool ascending) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if ((ascending && arr[j] < pivot) || (!ascending && arr[j] > pivot)) {
            swap(arr[i++], arr[j]);
        }
    }
    swap(arr[i], arr[high]);
    return i;
}

// 归并排序
void mergeSort(vector& arr, int left, int right, bool ascending = true) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid, ascending);
        mergeSort(arr, mid + 1, right, ascending);
        merge(arr, left, mid, right, ascending);
    }
}

void merge(vector& arr, int left, int mid, int right, bool ascending) {
    vector leftArr(arr.begin() + left, arr.begin() + mid + 1);
    vector rightArr(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;

    while (i < leftArr.size() && j < rightArr.size()) {
        if ((ascending && leftArr[i] <= rightArr[j]) ||
            (!ascending && leftArr[i] >= rightArr[j])) {
            arr[k++] = leftArr[i++];
        }
        else {
            arr[k++] = rightArr[j++];
        }
    }

    while (i < leftArr.size()) {
        arr[k++] = leftArr[i++];
    }

    while (j < rightArr.size()) {
        arr[k++] = rightArr[j++];
    }
}
// 堆排序
void heapify(vector& arr, int n, int i, bool ascending);
void heapSort(vector& arr, bool ascending = true) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i, ascending);

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0, ascending);
    }
}

void heapify(vector& arr, int n, int i, bool ascending) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    int order = ascending ? 1 : -1;

    if (left < n && arr[left] * order > arr[largest] * order)
        largest = left;

    if (right < n && arr[right] * order > arr[largest] * order)
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest, ascending);
    }
}

// 冒泡排序
void bubbleSort(vector& arr, bool ascending = true) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if ((ascending && arr[j] > arr[j + 1]) ||
                (!ascending && arr[j] < arr[j + 1])) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// 插入排序
void insertionSort(vector& arr, bool ascending = true) {
    for (int i = 1; i < arr.size(); ++i) {
        int key = arr[i];
        int j = i - 1;

        // 将 arr[i] 插入到已排序序列 arr[0...i-1] 中的正确位置
        while (j >= 0 && ((ascending && arr[j] > key) || (!ascending && arr[j] < key))) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// 希尔排序
void shellSort(vector& arr, bool ascending = true) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && ((ascending && arr[j - gap] > temp) || (!ascending && arr[j - gap] < temp)); j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}
bool readFromFile(const string& filename, vector& arr) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "无法打开文件：" << filename << endl;
        return false;
    }

    int value;
    while (file >> value) {
        arr.push_back(value);
    }
    file.close();
    return true;
}
// 打印数组
void printArray(const vector& arr) {
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

// 主函数
int main() {
    char continue_choice;
    do {
        int choice, order;
        vector arr;
        bool ascending;

        cout << "选择操作：\n";
        cout << "1. 手动输入元素数量并排序\n";
        cout << "2. 从文件中读取数据并排序\n";
        cout << "输入你的选择(1 - 2): ";
        cin >> choice;

        if (choice == 1) {
            int n;
            cout << "输入元素数量： ";
            cin >> n;
            arr.resize(n);
            cout << "输入这 " << n << " 个元素: ";
            for (int i = 0; i < n; i++) {
                cin >> arr[i];
            }
        }
        else if (choice == 2) {
            string filename;
            cout << "输入文件名（包含路径）: ";
            cin >> filename;
            if (!readFromFile(filename, arr)) {
                cout << "文件读取失败。" << endl;
                break; // 文件读取失败，退出循环
            }
        }
        else {
            cout << "无效的选择，请重新选择！" << endl;
            continue; // 选择无效，继续下一次循环
        }

        cout << "选择排序方法:\n";
        cout << "1. 快速排序\n";
        cout << "2. 归并排序\n";
        cout << "3. 堆排序\n";
        cout << "4. 冒泡排序\n";
        cout << "5. 插入排序\n";
        cout << "6. 希尔排序\n";
        cout << "输入你的选择(1 - 7) : ";
        cin >> choice;

        cout << "选择排序顺序（1 - 升序，2 - 降序）: ";
        cin >> order;
        ascending = (order == 1);

        auto start = high_resolution_clock::now();

        switch (choice) {
        case 1:
            quickSort(arr, 0, arr.size() - 1, ascending);
            break;
        case 2:
            mergeSort(arr, 0, arr.size() - 1, ascending);
            break;
        case 3:
            heapSort(arr, ascending);
            break;
        case 4:
            bubbleSort(arr, ascending);
            break;
        case 5:
            insertionSort(arr, ascending);
            break;
        case 6:
            shellSort(arr, ascending);
            break;
        default:
            cout << "无效的排序方法选择！" << endl;
            return 1;
        }

        auto stop = high_resolution_clock::now();
        auto duration = duration_cast(stop - start);

        cout << "排序数组：";
        printArray(arr);
        cout << "函数执行用时 " << duration.count() << " 微秒" << endl;

        cout << "是否继续（y/n）？: ";
        cin >> continue_choice;
    } while (continue_choice == 'y' || continue_choice == 'Y');

    return 0;
}