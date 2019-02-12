const path = require("path");
const fs = require("fs");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {             //Осуществляет поиск всех HTML страниц
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false              //Команда отменяет самостоятельное встраиваение ссылок на js и css файл в HTML
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");

const config = {
  entry: ["./src/js/index.js", "./src/scss/style.scss"],            //Входной скрипт js и scss или "точка входа"
  output: {
    filename: "./js/bundle.js"            //Скрипт js на выходе или "точка выхода"
  },
  devtool: "source-map",              //Создание карты исходников для js и css файлов
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({          //Плагин для минимизации js
        sourceMap: true,
        extractComments: true           //Комментарии извлекаются в отдельный файл
      })
    ]
  },
  module: {
    rules: [            //rules для обработки конкретных файлов по конкретным правилам
      {
        test: /\.(sass|scss)$/,         //Все файлы с расширением sass|scss
        include: path.resolve(__dirname, "src/scss"),           //Абсолютный путь к файлам с расширением scss
        use: [
          {
            loader: MiniCssExtractPlugin.loader,          //Загрузчик минификатора CSS
            options: {}
          },
          {
            loader: "css-loader",         //Плагин позволяющий хранить CSS внутри js-модуля
            options: {
              sourceMap: true,            //Включение карт источников для css-loader
              url: false          //Все ссылки на файлы в SCSS коде не трогаем, пути не меняем, никакие файлы не копируем и не встраиваем
            }
          },
          {
            loader: "postcss-loader",          //Postcss плагин
            options: {
              ident: "postcss",
              sourceMap: true,          //Включение карт источников для postcss
              plugins: () => [
                require("autoprefixer")({         //Плагин Autoprefixer
                  browsers: ['ie >= 11', 'last 3 version']         //Настройки Autoprefixer
                }),
                require("cssnano")({          //Плагин CSS-nano
                  preset: [
                    "default",
                    {
                      discardComments: {
                        removeAll: true           //Удаление комментариев в конечных файлах
                      }
                    }
                  ]
                })
              ]
            }
          },
          {
            loader: "sass-loader",          //Компилирует Sass в CSS
            options: {
              sourceMap: true             //Включение карт источников для sass-loader
            }
          }
        ]
      },
      {
        test: /\.html$/,           //Все файлы с расширением html
        include: path.resolve(__dirname, "src/html/includes"),        //Абсолютный путь к hmtl файлам
        use: ["raw-loader"]             //Плагин загружает html как текст
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: "babel-loader",           //Прогоняет все файлы js через Babel
          options: {
            presets: [
              "@babel/preset-env"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"           //Файл css на выходе или "точка выхода"
    }),
    new CopyWebpackPlugin([            //Плагин который просто копирует файлы
      {
        from: "./src/fonts",            //Подтягивает шрифты
        to: "./fonts"
      },
      {
        from: "./src/favicon",              //Подтягивает иконки сайта
        to: "./favicon"
      },
      {
        from: "./src/img",              //Подтягивает общие изображения
        to: "./img"
      },
      {
        from: "./src/uploads",          //Подтягивает изображения всяких статей, постов
        to: "./uploads"
      }
    ])
  ].concat(htmlPlugins)         //Слияние HTML файлов
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin("dist"));        //Плагин очищающий папку dist перед каждой сборкой проекта
  }
  return config;
};
