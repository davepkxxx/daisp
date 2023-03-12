import generate from "@babel/generator";
import { parse } from "@daisp/parser";
import { transform } from "@daisp/transform";
import PluginError from "plugin-error";
import { Transform } from "stream";
import type Vinyl from "vinyl";

function daisp(): NodeJS.ReadWriteStream {
  return new Transform({
    objectMode: true,
    transform: (chunk: Vinyl, encoding, callback) => {
      if (chunk.isNull()) {
        callback(null, chunk);
      } else if (chunk.isStream()) {
        callback(new PluginError("gulp-daisp", "Streaming not supported"));
      } else {
        if (chunk.contents) {
          chunk.contents = Buffer.from(
            generate(transform(parse(chunk.contents.toString()))).code
          );
        }
        callback(null, chunk);
      }
    },
  });
}

export default daisp;
