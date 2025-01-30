import { WaterService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware";
import { waterGoalSchema } from "../validations";

class WaterController {
  setGoal = asyncHandler(async (req, res) => {
    const validated = waterGoalSchema.parse(req.body);
    const goal = await WaterService.setGoal(req.user.id, validated);
    res.json(goal);
  });

  addIntake = asyncHandler(async (req, res) => {
    const validated = waterGoalSchema.parse(req.body);
    const updated = await WaterService.addIntake(req.user.id, validated.amount);
    res.json(updated);
  });

  getProgress = asyncHandler(async (req, res) => {
    const progress = await WaterService.getProgress(req.user.id);
    res.json(progress);
  });
}

export default new WaterController();
