#include <iostream>
#include <vector>
#include <chrono>
#include <cmath>
#include <algorithm>
#include <numeric>

using namespace std;
using namespace std::chrono;

// 整数运算测试
void integerOperationTest(int iterations)
{
    auto start = high_resolution_clock::now();

    int a = 1, b = 2, c = 3;
    for (int i = 0; i < iterations; ++i)
    {
        a = b + c;
        b = a * c;
        c = a + b;
        a = b - c;
        b = c / (a + 1);
        c = (a * b) % (c + 1);
    }

    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    cout << "整数运算测试 (" << iterations << " 次迭代): "
         << duration << " 毫秒" << endl;
    cout << "防止优化: " << a << b << c << endl; // 防止编译器优化掉计算
}

// 浮点运算测试
void floatingPointOperationTest(int iterations)
{
    auto start = high_resolution_clock::now();

    double a = 1.0, b = 2.0, c = 3.0;
    for (int i = 0; i < iterations; ++i)
    {
        a = b + c;
        b = a * c;
        c = sin(a) + cos(b);
        a = sqrt(b * b + c * c);
        b = log(fabs(a) + 1.0);
        c = exp(-0.1 * a);
    }

    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    cout << "浮点运算测试 (" << iterations << " 次迭代): "
         << duration << " 毫秒" << endl;
    cout << "防止优化: " << a << b << c << endl;
}

// 内存访问测试
void memoryAccessTest(int size)
{
    vector<int> data(size);
    iota(data.begin(), data.end(), 0); // 填充0,1,2,...,size-1

    auto start = high_resolution_clock::now();

    // 顺序访问
    int sum = 0;
    for (int i = 0; i < size; ++i)
    {
        sum += data[i];
    }

    // 随机访问
    for (int i = 0; i < size; ++i)
    {
        int index = rand() % size;
        data[index] = i;
    }

    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    cout << "内存访问测试 (" << size << " 个元素): "
         << duration << " 毫秒" << endl;
    cout << "防止优化: " << sum << data[0] << endl;
}

// 混合运算测试
void mixedOperationTest(int iterations)
{
    auto start = high_resolution_clock::now();

    vector<double> array(1000);
    double sum = 0.0;

    for (int i = 0; i < iterations; ++i)
    {
        // 一些计算
        double x = sin(i * 0.01);
        double y = cos(i * 0.02);
        double z = sqrt(x * x + y * y);

        // 数组操作
        array[i % 1000] = z;

        // 条件分支
        if (z > 1.0)
        {
            sum += z;
        }
        else
        {
            sum -= z;
        }
    }

    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    cout << "混合运算测试 (" << iterations << " 次迭代): "
         << duration << " 毫秒" << endl;
    cout << "防止优化: " << sum << array[0] << endl;
}

// 主测试函数
void runCpuBenchmark()
{
    const int intIterations = 100000000;  // 1亿次整数运算
    const int floatIterations = 50000000; // 5千万次浮点运算
    const int memorySize = 10000000;      // 1千万个元素的内存测试
    const int mixedIterations = 25000000; // 2千5百万次混合运算

    cout << "开始CPU性能测试..." << endl;
    cout << "--------------------------------" << endl;

    integerOperationTest(intIterations);
    floatingPointOperationTest(floatIterations);
    memoryAccessTest(memorySize);
    mixedOperationTest(mixedIterations);

    cout << "--------------------------------" << endl;
    cout << "CPU性能测试完成" << endl;
}

int main()
{
    runCpuBenchmark();
    return 0;
}