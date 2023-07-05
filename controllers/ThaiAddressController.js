const { QueryTypes } = require('sequelize');
const {
  ThaiProvinces,
  ThaiAmphures,
  ThaiTambons,
  sequelize,
} = require('../models');

exports.getThaiProvinces = async (req, res, next) => {
  try {
    const thaiProvinces = await ThaiProvinces.findAll({
      order: [['nameTh']],
    });

    res.json({ thaiProvinces });
  } catch (err) {
    next(err);
  }
};

exports.getThaiAmphures = async (req, res, next) => {
  try {
    const { provinceId } = req.params;

    const thaiAmphures = await ThaiAmphures.findAll({
      where: { provinceId: provinceId },
      order: [['nameTh']],
    });

    res.json({ thaiAmphures });
  } catch (err) {
    next(err);
  }
};

exports.getThaiTambons = async (req, res, next) => {
  try {
    const { amphureId } = req.params;
    const thaiTambons = await ThaiTambons.findAll({
      where: { amphureId: amphureId },
      order: [['nameTh']],
    });

    res.json({ thaiTambons });
  } catch (err) {
    next(err);
  }
};

exports.getThaiZipCodes = async (req, res, next) => {
  try {
    const { tambonId } = req.params;
    const thaiZipCodes = await ThaiTambons.findAll({
      where: { id: tambonId },
    });

    res.json({ thaiZipCodes });
  } catch (err) {
    next(err);
  }
};

exports.getThaiAddressId = async (req, res, next) => {
  try {
    const { subDistrict, district, province, postcode } = req.query;

    const thaiAddress = await sequelize.query(
      `select pro.id provinceId, amp.id amphureId, tam.id tambonId  from (thai_provinces pro left join thai_amphures amp on pro.id = amp.province_id) left join thai_tambons tam on amp.id = tam.amphure_id where tam.name_th = '${subDistrict}' and amp.name_th = '${district}' and pro.name_th = '${province}' and tam.zip_code = ${postcode} ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ thaiAddressId: thaiAddress[0] });
  } catch (err) {
    next(err);
  }
};
