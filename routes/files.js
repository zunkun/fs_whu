const Router = require('koa-router');
const multer = require('koa-multer');
const ResService = require('../core/ResService');
const config = require('../config');
const util = require('../core/util');

const videoStorage = multer.diskStorage({
	// 视屏保存路径
	destination: (req, file, cb) => {
		cb(null, config.videoPath);
	},
	// 修改文件名称
	filename: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		cb(null, Date.now() + util.randomNum() + '.' + fileFormat[fileFormat.length - 1]);
	}
});
const imageStorage = multer.diskStorage({
	// 图片保存路径
	destination: (req, file, cb) => {
		cb(null, config.imagePath);
	},
	// 修改文件名称
	filename: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		cb(null, Date.now() + util.randomNum() + '.' + fileFormat[fileFormat.length - 1]);
	}
});

// 加载配置
const videoUpload = multer({ storage: videoStorage, limits: { fileSize: '4096M', files: 1 } });
const imageUpload = multer({
	storage: imageStorage,
	limits: { fileSize: '200M', files: 1 },
	fileFilter: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		const ext = (fileFormat[fileFormat.length - 1] || '').toLowerCase();

		let isLeagal = [ 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff' ].indexOf(ext) > -1;
		if (isLeagal) {
			cb(null, true);
		} else {
			cb(new Error('必须上传 .jpg 或 .png 格式的图片'));
		}
	}
});

const router = new Router();

router.prefix('/api/files');

/**
* @api {post} /api/files/video 上传视屏
* @apiName video-upload
* @apiGroup 文件
* @apiDescription 上传视屏文件，data和belongsTo 字段任选一个传递都会返回，建议使用belongsTo
* @apiParam  {File} file 文件信息
* @apiParam {any} [data] 文件传递值，该字段会返回
* @apiParam {String} [belongsTo] 文件属于谁，该字段会返回
* @apiSuccess {Object} data 返回数据
* @apiSuccess {String} data.name 返回文件名称
* @apiSuccess {any} data.[data] 传递data值返回
* @apiSuccess {String} data.[belongsTo] 传递belongsTo 返回
* @apiSuccess {Number} errcode 成功为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/video', videoUpload.single('file'), async (ctx, next) => {
	const fileInfo = ctx.req.file;
	const { data, belongsTo } = ctx.request.body;
	const query = ctx.query;
	if (!fileInfo) {
		ctx.body = ResService.fail('上传视屏错误');
		return;
	}
	query.name = fileInfo.filename;
	if (data) query.data = data;
	if (belongsTo) query.belongsTo = belongsTo;
	ctx.body = ResService.success(query);
	next();
});

/**
* @api {post} /api/files/images 上传图片
* @apiName file-images
* @apiGroup 文件
* @apiDescription 上传图片，data和belongsTo 字段任选一个传递都会返回,建议使用belongsTo
* @apiParam  {File} file 文件信息
* @apiParam {any} [data] 文件传递值，该字段会返回
* @apiParam {String} [belongsTo] 文件属于谁，该字段会返回
* @apiSuccess {Object} data 返回值
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {} 图片信息
* @apiSuccess {String} data.name  图片名称
* @apiSuccess {any} data.[data] 传递data值返回
* @apiSuccess {String} data.[belongsTo] 传递belongsTo 返回
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/image', imageUpload.single('file'), async (ctx, next) => {
	const fileInfo = ctx.req.file;
	const { data, belongsTo } = ctx.request.body;
	const query = ctx.query;
	if (!fileInfo) {
		ctx.body = ResService.fail('上传图片错误');
		return;
	}
	query.name = fileInfo.filename;
	if (data) query.data = data;
	if (belongsTo) query.belongsTo = belongsTo;
	ctx.body = ResService.success(query);
	next();
});

module.exports = router;
