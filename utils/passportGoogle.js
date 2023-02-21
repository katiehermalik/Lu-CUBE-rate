const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models");
const seedData = require("../data/seed-data.json");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "/api/v1/oauth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      let signupData = {};

      const addNewUserCategories = async newUser => {
        const newCategories = seedData.categories.map(category => ({
          ...category,
          user: newUser._id,
        }));
        const createdCategories = await db.Category.create(newCategories);
        createdCategories.forEach(category => {
          signupData[category.title] = category._id;
          newUser.categories.push(category._id);
        });
        await addNewUserCubes(newUser);
        const populatedUser = await db.User.findOne({ _id: newUser._id })
          .populate("categories")
          .populate("cubes");
        return populatedUser;
      };

      const addNewUserCubes = async newUser => {
        const newCubes = seedData.cubes.map(cube => ({
          ...cube,
          user: String(newUser._id),
          category: String(signupData[cube.category]),
        }));
        const createdCubes = await db.Cube.create(newCubes);
        createdCubes.forEach(async cube => {
          newUser.cubes.push(cube._id);
          const foundCategory = await db.Category.findById(cube.category);
          foundCategory.cubes.push(cube._id);
          await foundCategory.save();
        });
        await newUser.save();
        return newUser;
      };

      const currentUser = await db.User.findOne({ googleId: profile.id });
      if (!currentUser) {
        const user = new db.User({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: profile.id,
          googleId: profile.id,
        });
        const newUser = await user.save();
        const completedUser = await addNewUserCategories(newUser);
        done(null, completedUser);
      } else {
        done(null, currentUser);
      }
    }
  )
);