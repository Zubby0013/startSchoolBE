import { Request, Response } from "express";
import schoolModel from "../model/schoolModel";
import sessionModel from "../model/sessionModel";
import { Types } from "mongoose";
import studentModel from "../model/studentModel";
import storeModel from "../model/storeModel";
import { streamUpload } from "../utils/streamifier";

export const createStore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID } = req.params;
    const { title, description, cost } = req.body;

    const school = await schoolModel.findById(schoolID);

    const { secure_url, public_id }: any = await streamUpload(req);

    if (school) {
      const store = await storeModel.create({
        title,
        description,
        cost,
        avatar: secure_url,
        avatarID: public_id,
      });

      school?.store.push(new Types.ObjectId(store._id));
      school.save();

      return res.status(201).json({
        message: "remark created successfully",
        data: store,
      });
    } else {
      return res.status(404).json({
        message: "unable to read school",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating school session",
    });
  }
};

export const viewSchoolStore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { schoolID } = req.params;
    const student = await studentModel.findById(schoolID).populate({
      path: "store",
    });

    return res.status(200).json({
      message: "viewing school store",
      data: student?.remark,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error viewing school session",
    });
  }
};