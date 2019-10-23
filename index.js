const JsonToTS = require('json-to-ts');
const fs = require('fs');

const IN_DIR = __dirname + "/in/";
const OUT_DIR = __dirname + "/out/";

console.log("-- start --");
files = fs.readdirSync(IN_DIR);
files = files.filter(v => /.*\.json$/.test(v));
for (let i = 0; i < files.length; i++) {
    // 出力ファイル名決め
    const fileName = files[i].split(".")[0];
    const outFileName = fileName.charAt(0).toUpperCase() + fileName.substring(1);

    // jsonをパース
    const jsonString = fs.readFileSync(IN_DIR + files[i]);
    const json = JSON.parse(jsonString);

    // 出力ファイルをクリア
    fs.writeFileSync(OUT_DIR + outFileName + ".ts", "");

    let isFirst = true;
    JsonToTS(json).forEach(type => {

        // 出力先が無ければ作る
        if (!fs.existsSync(OUT_DIR)) {
            fs.mkdirSync(OUT_DIR);
        }

        // ルートオブジェクトの型名だけ訂正
        if (isFirst)
            type = type.replace("RootObject", outFileName + "JsonRoot");

        // インデント調整
        type = type.replace(/  /g, "    ");

        // 書き出し
        fs.appendFileSync(OUT_DIR + outFileName + ".ts", type + "\n\n");

        isFirst = false;
    });

    console.log(files[i] + " --> " + outFileName + ".ts");
}

console.log("-- end --");
