"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/queues";
exports.ids = ["pages/api/queues"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "(api)/./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"API_ENDPOINT\": () => (/* binding */ API_ENDPOINT),\n/* harmony export */   \"BOARD_ID\": () => (/* binding */ BOARD_ID),\n/* harmony export */   \"COOKIE_MAX_AGE\": () => (/* binding */ COOKIE_MAX_AGE),\n/* harmony export */   \"INTERNAL_SERVER_ERROR\": () => (/* binding */ INTERNAL_SERVER_ERROR)\n/* harmony export */ });\nconst API_ENDPOINT = \"/api\";\nconst COOKIE_MAX_AGE = 60 * 90;\nconst BOARD_ID = \"8rgyOKIO\" || 0;\nconst INTERNAL_SERVER_ERROR = \"Internal Server Error\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvY29uc3RhbnRzLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBTyxNQUFNQSxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBRTVCLE1BQU1DLGNBQWMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBRS9CLE1BQU1DLFFBQVEsR0FBR0MsVUFBdUMsSUFBSSxDQUFFLENBQUM7QUFFL0QsTUFBTUcscUJBQXFCLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9xdWV1ZXVwLy4vc3JjL2NvbnN0YW50cy50cz8zN2ZmIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBBUElfRU5EUE9JTlQgPSBcIi9hcGlcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBDT09LSUVfTUFYX0FHRSA9IDYwICogOTA7XHJcblxyXG5leHBvcnQgY29uc3QgQk9BUkRfSUQgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19UUkVMTE9fQk9BUkRfSUQgfHwgXCJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBJTlRFUk5BTF9TRVJWRVJfRVJST1IgPSBcIkludGVybmFsIFNlcnZlciBFcnJvclwiO1xyXG4iXSwibmFtZXMiOlsiQVBJX0VORFBPSU5UIiwiQ09PS0lFX01BWF9BR0UiLCJCT0FSRF9JRCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19UUkVMTE9fQk9BUkRfSUQiLCJJTlRFUk5BTF9TRVJWRVJfRVJST1IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/constants.ts\n");

/***/ }),

/***/ "(api)/./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"logger\": () => (/* binding */ logger)\n/* harmony export */ });\n/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! winston */ \"winston\");\n/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(winston__WEBPACK_IMPORTED_MODULE_0__);\n\nconst logger = winston__WEBPACK_IMPORTED_MODULE_0___default().createLogger({\n    level: \"info\",\n    format: winston__WEBPACK_IMPORTED_MODULE_0___default().format.combine(winston__WEBPACK_IMPORTED_MODULE_0___default().format.timestamp(), winston__WEBPACK_IMPORTED_MODULE_0___default().format.printf(({ level , message , timestamp , stack  })=>{\n        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;\n    })),\n    transports: [\n        new (winston__WEBPACK_IMPORTED_MODULE_0___default().transports.Console)()\n    ]\n});\nlogger.info(\"Logging setup complete\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbG9nZ2VyLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QjtBQVN2QixNQUFNQyxNQUFNLEdBQUdELDJEQUFvQixDQUFDO0lBQ3pDRyxLQUFLLEVBQUUsTUFBTTtJQUNiQyxNQUFNLEVBQUVKLDZEQUFzQixDQUM1QkEsK0RBQXdCLEVBQUUsRUFDMUJBLDREQUFxQixDQUFDLENBQUMsRUFBRUcsS0FBSyxHQUFFSyxPQUFPLEdBQUVGLFNBQVMsR0FBRUcsS0FBSyxHQUFXLEdBQUs7UUFDdkUsT0FBTyxDQUFDLEVBQUVILFNBQVMsQ0FBQyxFQUFFLEVBQUVILEtBQUssQ0FBQ08sV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFRCxLQUFLLElBQUlELE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQ0g7SUFDREcsVUFBVSxFQUFFO1FBQUMsSUFBSVgsbUVBQTBCLEVBQUU7S0FBQztDQUMvQyxDQUFDLENBQUM7QUFFSEMsTUFBTSxDQUFDWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3F1ZXVldXAvLi9zcmMvbG9nZ2VyLnRzPzQ3NzciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdpbnN0b24gZnJvbSBcIndpbnN0b25cIjtcclxuXHJcbmludGVyZmFjZSBMb2dJbmZvIHtcclxuICBsZXZlbDogc3RyaW5nO1xyXG4gIG1lc3NhZ2U6IHN0cmluZztcclxuICB0aW1lc3RhbXA/OiBzdHJpbmc7XHJcbiAgc3RhY2s/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2dnZXIgPSB3aW5zdG9uLmNyZWF0ZUxvZ2dlcih7XHJcbiAgbGV2ZWw6IFwiaW5mb1wiLFxyXG4gIGZvcm1hdDogd2luc3Rvbi5mb3JtYXQuY29tYmluZShcclxuICAgIHdpbnN0b24uZm9ybWF0LnRpbWVzdGFtcCgpLFxyXG4gICAgd2luc3Rvbi5mb3JtYXQucHJpbnRmKCh7IGxldmVsLCBtZXNzYWdlLCB0aW1lc3RhbXAsIHN0YWNrIH06IExvZ0luZm8pID0+IHtcclxuICAgICAgcmV0dXJuIGAke3RpbWVzdGFtcH0gWyR7bGV2ZWwudG9VcHBlckNhc2UoKX1dOiAke3N0YWNrIHx8IG1lc3NhZ2V9YDtcclxuICAgIH0pXHJcbiAgKSxcclxuICB0cmFuc3BvcnRzOiBbbmV3IHdpbnN0b24udHJhbnNwb3J0cy5Db25zb2xlKCldLFxyXG59KTtcclxuXHJcbmxvZ2dlci5pbmZvKFwiTG9nZ2luZyBzZXR1cCBjb21wbGV0ZVwiKTtcclxuIl0sIm5hbWVzIjpbIndpbnN0b24iLCJsb2dnZXIiLCJjcmVhdGVMb2dnZXIiLCJsZXZlbCIsImZvcm1hdCIsImNvbWJpbmUiLCJ0aW1lc3RhbXAiLCJwcmludGYiLCJtZXNzYWdlIiwic3RhY2siLCJ0b1VwcGVyQ2FzZSIsInRyYW5zcG9ydHMiLCJDb25zb2xlIiwiaW5mbyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/logger.ts\n");

/***/ }),

/***/ "(api)/./src/pages/api/queues.tsx":
/*!**********************************!*\
  !*** ./src/pages/api/queues.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _services_getQueues__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/getQueues */ \"(api)/./src/services/getQueues.tsx\");\n/* harmony import */ var _withErrorHandling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../withErrorHandling */ \"(api)/./src/withErrorHandling.ts\");\nconst axios = __webpack_require__(/*! axios */ \"axios\");\nconst { parse: parseUrl  } = __webpack_require__(/*! url */ \"url\");\n\n\n/**\r\n * Function for Queue / List Trello API calls\r\n */ async function handler(req, res) {\n    const { method: httpMethod  } = req;\n    if (httpMethod === \"GET\") {\n        const { status , data  } = await (0,_services_getQueues__WEBPACK_IMPORTED_MODULE_0__.getQueues)();\n        return res.status(status).json(data);\n    } else {\n        return res.status(405).json(null);\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_withErrorHandling__WEBPACK_IMPORTED_MODULE_1__.withErrorHandling)(handler));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3F1ZXVlcy50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTUEsS0FBSyxHQUFHQyxtQkFBTyxDQUFDLG9CQUFPLENBQUM7QUFDOUIsTUFBTSxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsR0FBRSxHQUFHRixtQkFBTyxDQUFDLGdCQUFLLENBQUM7QUFFVztBQUNPO0FBRTVEO0lBSUUsTUFBTSxFQUFFUSxNQUFNLEVBQUVDLFVBQVUsR0FBRSxHQUFHSCxHQUFHO0lBRWxDLElBQUlHLFVBQVUsS0FBSyxLQUFLLEVBQUU7UUFDeEIsTUFBTSxFQUFFQyxNQUFNLEdBQUVDLElBQUksR0FBRSxHQUFHO1FBQ3pCLE9BQU9KLEdBQUcsQ0FBQ0csTUFBTSxDQUFDQTtJQUNwQixPQUFPO1FBQ0wsT0FBT0gsR0FBRyxDQUFDRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0FBQ0gsQ0FBQztBQUVEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcXVldWV1cC8uL3NyYy9wYWdlcy9hcGkvcXVldWVzLnRzeD84ZWIzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xyXG5jb25zdCB7IHBhcnNlOiBwYXJzZVVybCB9ID0gcmVxdWlyZShcInVybFwiKTtcclxuaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcclxuaW1wb3J0IHsgZ2V0UXVldWVzIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2dldFF1ZXVlc1wiO1xyXG5pbXBvcnQgeyB3aXRoRXJyb3JIYW5kbGluZyB9IGZyb20gXCIuLi8uLi93aXRoRXJyb3JIYW5kbGluZ1wiO1xyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uIGZvciBRdWV1ZSAvIExpc3QgVHJlbGxvIEFQSSBjYWxsc1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG4gIGNvbnN0IHsgbWV0aG9kOiBodHRwTWV0aG9kIH0gPSByZXE7XHJcblxyXG4gIGlmIChodHRwTWV0aG9kID09PSBcIkdFVFwiKSB7XHJcbiAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gYXdhaXQgZ2V0UXVldWVzKCk7XHJcbiAgICByZXR1cm4gcmVzLnN0YXR1cyhzdGF0dXMpLmpzb24oZGF0YSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbihudWxsKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdpdGhFcnJvckhhbmRsaW5nKGhhbmRsZXIpO1xyXG4iXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwicGFyc2UiLCJwYXJzZVVybCIsImdldFF1ZXVlcyIsIndpdGhFcnJvckhhbmRsaW5nIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsImh0dHBNZXRob2QiLCJzdGF0dXMiLCJkYXRhIiwianNvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/queues.tsx\n");

/***/ }),

/***/ "(api)/./src/services/getQueues.tsx":
/*!************************************!*\
  !*** ./src/services/getQueues.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getQueues\": () => (/* binding */ getQueues)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ \"(api)/./src/constants.ts\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../logger */ \"(api)/./src/logger.ts\");\n\n\n\nconst getQueues = async ()=>{\n    const { TRELLO_KEY , TRELLO_TOKEN , IS_PUBLIC_BOARD , TRELLO_ENDPOINT =\"https://api.trello.com/1\" , NEXT_PUBLIC_TRELLO_BOARD_ID ,  } = process.env;\n    const tokenAndKeyParams = IS_PUBLIC_BOARD === \"true\" ? \"\" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`);\n        const message = response.status === 200 ? \"Successfully retrieved queues\" : \"Failed to retrieve queues\";\n        const returnData = response.status === 200 ? response.data.map((data)=>({\n                id: data.id,\n                name: data.name\n            })) : null;\n        return {\n            status: response.status,\n            data: {\n                message,\n                data: returnData\n            }\n        };\n    } catch (error) {\n        _logger__WEBPACK_IMPORTED_MODULE_2__.logger.error(error.message);\n        return {\n            status: error.response?.status || 500,\n            data: {\n                message: _constants__WEBPACK_IMPORTED_MODULE_1__.INTERNAL_SERVER_ERROR,\n                data: null\n            }\n        };\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvc2VydmljZXMvZ2V0UXVldWVzLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEwQjtBQUUyQjtBQUNsQjtBQUU1QixNQUFNRyxTQUFTLEdBQUcsVUFBNkM7SUFDcEUsTUFBTSxFQUNKQyxVQUFVLEdBQ1ZDLFlBQVksR0FDWkMsZUFBZSxHQUNmQyxlQUFlLEVBQUcsMEJBQTBCLEdBQzVDQywyQkFBMkIsS0FDNUIsR0FBR0MsT0FBTyxDQUFDQyxHQUFHO0lBQ2YsTUFBTUMsaUJBQWlCLEdBQ3JCTCxlQUFlLEtBQUssTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRUYsVUFBVSxDQUFDLE9BQU8sRUFBRUMsWUFBWSxDQUFDLENBQUM7SUFFN0UsSUFBSTtRQUNGLE1BQU1PLFFBQVEsR0FBRyxNQUFNWixnREFBUyxDQUM5QixDQUFDLEVBQUVPLGVBQWUsQ0FBQyxRQUFRLEVBQUVDLDJCQUEyQixDQUFDLE9BQU8sRUFBRUcsaUJBQWlCLENBQUMsQ0FBQyxDQUN0RjtRQUVELE1BQU1HLE9BQU8sR0FDWEYsUUFBUSxDQUFDRyxNQUFNLEtBQUssR0FBRyxHQUNuQiwrQkFBK0IsR0FDL0IsMkJBQTJCO1FBRWpDLE1BQU1DLFVBQVUsR0FDZEosUUFBUSxDQUFDRyxNQUFNLEtBQUssR0FBRyxHQUNuQkgsUUFBUSxDQUFDSyxJQUFJLENBQUNDLEdBQUcsQ0FBQyxDQUFDRCxJQUFZLEdBQU07Z0JBQ25DRSxFQUFFLEVBQUVGLElBQUksQ0FBQ0UsRUFBRTtnQkFDWEMsSUFBSSxFQUFFSCxJQUFJLENBQUNHLElBQUk7YUFDaEIsRUFBRSxHQUNILElBQUk7UUFFVixPQUFPO1lBQ0xMLE1BQU0sRUFBRUgsUUFBUSxDQUFDRyxNQUFNO1lBQ3ZCRSxJQUFJLEVBQUU7Z0JBQ0pILE9BQU87Z0JBQ1BHLElBQUksRUFBRUQsVUFBVTthQUNqQjtTQUNGLENBQUM7SUFDSixFQUFFLE9BQU9LLEtBQUssRUFBTztRQUNuQm5CLGlEQUFZLENBQUNtQixLQUFLLENBQUNQLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLE9BQU87WUFDTEMsTUFBTSxFQUFFTSxLQUFLLENBQUNULFFBQVEsRUFBRUcsTUFBTSxJQUFJLEdBQUc7WUFDckNFLElBQUksRUFBRTtnQkFBRUgsT0FBTyxFQUFFYiw2REFBcUI7Z0JBQUVnQixJQUFJLEVBQUUsSUFBSTthQUFFO1NBQ3JELENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcXVldWV1cC8uL3NyYy9zZXJ2aWNlcy9nZXRRdWV1ZXMudHN4PzEzMmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5pbXBvcnQgeyBJQXBpUmVzcG9uc2UsIElRdWV1ZSB9IGZyb20gXCIuLi9tb2RlbFwiO1xyXG5pbXBvcnQgeyBJTlRFUk5BTF9TRVJWRVJfRVJST1IgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRRdWV1ZXMgPSBhc3luYyAoKTogUHJvbWlzZTxJQXBpUmVzcG9uc2U8SVF1ZXVlW10+PiA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgVFJFTExPX0tFWSxcclxuICAgIFRSRUxMT19UT0tFTixcclxuICAgIElTX1BVQkxJQ19CT0FSRCxcclxuICAgIFRSRUxMT19FTkRQT0lOVCA9IFwiaHR0cHM6Ly9hcGkudHJlbGxvLmNvbS8xXCIsXHJcbiAgICBORVhUX1BVQkxJQ19UUkVMTE9fQk9BUkRfSUQsXHJcbiAgfSA9IHByb2Nlc3MuZW52O1xyXG4gIGNvbnN0IHRva2VuQW5kS2V5UGFyYW1zID1cclxuICAgIElTX1BVQkxJQ19CT0FSRCA9PT0gXCJ0cnVlXCIgPyBcIlwiIDogYGtleT0ke1RSRUxMT19LRVl9JnRva2VuPSR7VFJFTExPX1RPS0VOfWA7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChcclxuICAgICAgYCR7VFJFTExPX0VORFBPSU5UfS9ib2FyZHMvJHtORVhUX1BVQkxJQ19UUkVMTE9fQk9BUkRfSUR9L2xpc3RzPyR7dG9rZW5BbmRLZXlQYXJhbXN9YFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBtZXNzYWdlID1cclxuICAgICAgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDBcclxuICAgICAgICA/IFwiU3VjY2Vzc2Z1bGx5IHJldHJpZXZlZCBxdWV1ZXNcIlxyXG4gICAgICAgIDogXCJGYWlsZWQgdG8gcmV0cmlldmUgcXVldWVzXCI7XHJcblxyXG4gICAgY29uc3QgcmV0dXJuRGF0YSA9XHJcbiAgICAgIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwXHJcbiAgICAgICAgPyByZXNwb25zZS5kYXRhLm1hcCgoZGF0YTogSVF1ZXVlKSA9PiAoe1xyXG4gICAgICAgICAgICBpZDogZGF0YS5pZCxcclxuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgOiBudWxsO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICBkYXRhOiByZXR1cm5EYXRhLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBsb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXM6IGVycm9yLnJlc3BvbnNlPy5zdGF0dXMgfHwgNTAwLFxyXG4gICAgICBkYXRhOiB7IG1lc3NhZ2U6IElOVEVSTkFMX1NFUlZFUl9FUlJPUiwgZGF0YTogbnVsbCB9LFxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJheGlvcyIsIklOVEVSTkFMX1NFUlZFUl9FUlJPUiIsImxvZ2dlciIsImdldFF1ZXVlcyIsIlRSRUxMT19LRVkiLCJUUkVMTE9fVE9LRU4iLCJJU19QVUJMSUNfQk9BUkQiLCJUUkVMTE9fRU5EUE9JTlQiLCJORVhUX1BVQkxJQ19UUkVMTE9fQk9BUkRfSUQiLCJwcm9jZXNzIiwiZW52IiwidG9rZW5BbmRLZXlQYXJhbXMiLCJyZXNwb25zZSIsImdldCIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJyZXR1cm5EYXRhIiwiZGF0YSIsIm1hcCIsImlkIiwibmFtZSIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/services/getQueues.tsx\n");

/***/ }),

/***/ "(api)/./src/withErrorHandling.ts":
/*!**********************************!*\
  !*** ./src/withErrorHandling.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"withErrorHandling\": () => (/* binding */ withErrorHandling)\n/* harmony export */ });\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ \"(api)/./src/logger.ts\");\n\nfunction withErrorHandling(handler) {\n    return async function(req, res) {\n        try {\n            _logger__WEBPACK_IMPORTED_MODULE_0__.logger.info({\n                message: `Method: ${req.method}, route: ${req.url} :: START`\n            });\n            await handler(req, res);\n        } catch (err) {\n            if (err instanceof Error) {\n                _logger__WEBPACK_IMPORTED_MODULE_0__.logger.error({\n                    message: err.message,\n                    stack: err.stack,\n                    name: err.name\n                });\n            } else {\n                _logger__WEBPACK_IMPORTED_MODULE_0__.logger.error({\n                    message: \"An unknown error occurred\"\n                });\n            }\n            res.status(500).json({\n                error: \"An internal error occurred\"\n            });\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvd2l0aEVycm9ySGFuZGxpbmcudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDa0M7QUFJM0IsU0FBU0MsaUJBQWlCLENBQUNDLE9BQW1CLEVBQWM7SUFDakUsT0FBTyxlQUFnQkMsR0FBbUIsRUFBRUMsR0FBb0IsRUFBRTtRQUNoRSxJQUFJO1lBQ0ZKLGdEQUFXLENBQUM7Z0JBQ1ZNLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRUgsR0FBRyxDQUFDSSxNQUFNLENBQUMsU0FBUyxFQUFFSixHQUFHLENBQUNLLEdBQUcsQ0FBQyxTQUFTLENBQUM7YUFDN0QsQ0FBQyxDQUFDO1lBRUgsTUFBTU4sT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsT0FBT0ssR0FBRyxFQUFXO1lBQ3JCLElBQUlBLEdBQUcsWUFBWUMsS0FBSyxFQUFFO2dCQUN4QlYsaURBQVksQ0FBQztvQkFDWE0sT0FBTyxFQUFFRyxHQUFHLENBQUNILE9BQU87b0JBQ3BCTSxLQUFLLEVBQUVILEdBQUcsQ0FBQ0csS0FBSztvQkFDaEJDLElBQUksRUFBRUosR0FBRyxDQUFDSSxJQUFJO2lCQUNmLENBQUMsQ0FBQztZQUNMLE9BQU87Z0JBQ0xiLGlEQUFZLENBQUM7b0JBQUVNLE9BQU8sRUFBRSwyQkFBMkI7aUJBQUUsQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFFREYsR0FBRyxDQUFDVSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztnQkFBRUosS0FBSyxFQUFFLDRCQUE0QjthQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3F1ZXVldXAvLi9zcmMvd2l0aEVycm9ySGFuZGxpbmcudHM/MmJiNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XHJcblxyXG50eXBlIEFwaUhhbmRsZXIgPSAocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpID0+IFByb21pc2U8dm9pZD47XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVycm9ySGFuZGxpbmcoaGFuZGxlcjogQXBpSGFuZGxlcik6IEFwaUhhbmRsZXIge1xyXG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiAocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKHtcclxuICAgICAgICBtZXNzYWdlOiBgTWV0aG9kOiAke3JlcS5tZXRob2R9LCByb3V0ZTogJHtyZXEudXJsfSA6OiBTVEFSVGAsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXdhaXQgaGFuZGxlcihyZXEsIHJlcyk7XHJcbiAgICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcclxuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHtcclxuICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxyXG4gICAgICAgICAgc3RhY2s6IGVyci5zdGFjayxcclxuICAgICAgICAgIG5hbWU6IGVyci5uYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IG1lc3NhZ2U6IFwiQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZFwiIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkFuIGludGVybmFsIGVycm9yIG9jY3VycmVkXCIgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOlsibG9nZ2VyIiwid2l0aEVycm9ySGFuZGxpbmciLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiaW5mbyIsIm1lc3NhZ2UiLCJtZXRob2QiLCJ1cmwiLCJlcnIiLCJFcnJvciIsImVycm9yIiwic3RhY2siLCJuYW1lIiwic3RhdHVzIiwianNvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/withErrorHandling.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/queues.tsx"));
module.exports = __webpack_exports__;

})();