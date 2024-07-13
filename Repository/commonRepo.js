exports.createRecord = async (model, data) => {
    try {
      const record = await model.create(data);
      return record;
    } catch (error) {
      throw error;
    }
  };

exports.deleteRecord = async (model, id) => {
    try {
      await model.update({ is_deleted: 1 }, { where: { id: id } });
    } catch (error) {
      throw error;
    }
  };

  exports.updateRecord = async (Model, id, data) => {
    try {
      await Model.update(data, { where: { id: id } });
    } catch (error) {
      throw error;
    }
  };