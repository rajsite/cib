(function () {
  'use strict';

  /*const source = String.raw`
#include <stdio.h>


int main() {
  printf("hello world!\n");
}
`*/

  /*const source = String.raw`
#include <emscripten.h>
#include <stdio.h>

int counter = 0;

void timer(void *) {
  printf("counter %p: %03d\n", &counter, counter++);
  emscripten_async_call(timer, nullptr, 1000);
}

int main() { timer(nullptr); }
`*/
/*
const source = String.raw`
#include <emscripten.h>


int main() {
  int hello = 7;
  emscripten_idb_async_store("THE_DB", "the_secret", &hello, sizeof(int), 0, 0, 0);
  return 0;
}
`
*/

/*
const source = String.raw`
#include <stdio.h>
#include <stdlib.h>

int main () {
   FILE * fp;

   fp = fopen ("file.txt", "w+");
   fprintf(fp, "%s %s %s %d", "We", "are", "in", 2012);
   
   fclose(fp);
   
   return(0);
}
`
*/
/*
const source = String.raw`
#include <emscripten.h>
#include <stdio.h>
using namespace std;

auto script = R"(
    Module.print('Hello from javascript!\n');

    let i = 0;
    function count() {
        Module.print('i = ' + i++);
        setTimeout(count, 500);
    }
    count();
)";

int main() { emscripten_run_script(script); }
`
*/

/*
const source = String.raw`
// cib:{"fetch":"range-v3-0.3.0.zip", "system_includes":["range-v3-0.3.0/include"], "unzip_compiler":true}

#include <iostream>
#include <range/v3/all.hpp>
#include <stdio.h>

using namespace ranges;

int main()
{
    // Define an infinite range containing all the Pythagorean triples:
    auto triples =
        view::for_each(view::ints(1), [](int z)
        {
            return view::for_each(view::ints(1, z+1), [=](int x)
            {
                return view::for_each(view::ints(x, z+1), [=](int y)
                {
                    return yield_if(x*x + y*y == z*z, std::make_tuple(x, y, z));
                });
            });
        });

    //// This alternate syntax also works:
    //auto triples = view::ints(1)      >>= [] (int z) { return
    //               view::ints(1, z+1) >>= [=](int x) { return
    //               view::ints(x, z+1) >>= [=](int y) { return
    //   yield_if(x*x + y*y == z*z,
    //       std::make_tuple(x, y, z)); };}; };

    // Display the first 100 triples
    RANGES_FOR(auto triple, triples | view::take(100))
    {
        printf("(%d,%d,%d)\n", std::get<0>(triple), std::get<1>(triple),std::get<2>(triple));
    }
}
`
*/

const source = String.raw`
// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}

#define ARMA_DONT_USE_LAPACK
#define ARMA_DONT_USE_BLAS
#define ARMA_DONT_USE_NEWARP
#define ARMA_DONT_USE_ARPACK
#define ARMA_DONT_USE_SUPERLU
#define ARMA_DONT_USE_HDF5
#define ARMA_DONT_USE_OPENMP


#include <iostream>
#include <armadillo>
#include <stdio.h>

using namespace std;
using namespace arma;

int main()
  {

mat A = randu<mat>(4,5);
  mat B = randu<mat>(4,5);
     printf("%f\n", A[0]);
  return 0;
  }
`

// From the process-runtime worker:
// emModule.FS.readFile('/file.txt', { encoding: 'utf8' })
  
  let clangOutput;

  const runtime = new ProcessManager('runtime', 'runtime');
  runtime.print = ({text}) => console.log(text); 
  runtime.printErr = ({text}) => console.error(text);
  runtime.workerRunDone = args => {
      console.log('done running');
  };

  const run = function () {
      runtime.worker.postMessage({
            function: 'run',
            wasmBinary: clangOutput,
      });
  };

  const clang = new ProcessManager('clang', 'clang');
  clang.print = ({text}) => console.log(text); 
  clang.printErr = ({text}) => console.error(text);
  clang.workerCompileDone = function (args) {
      if (args.result)
          console.log('wasm size: ' + args.result.length + '\n');
      clangOutput = args.result;
 
      run();
  };
  
  
  window.compile = function (src) {
      if (!src) src = source;
      clangOutput = undefined;
      clang.worker.postMessage({
          function: 'compile',
          code: src,
      });
  }
  

  clang.start();
  runtime.start();

}());
