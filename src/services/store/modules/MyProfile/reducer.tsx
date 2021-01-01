import { profileEditedInfosActionProps, profileEditedInfosObjProps, usersProfileImagesObjActionProps, usersProfileImagesObjProps } from "./interfaces";
const usersProfileImagesObjInitialState: usersProfileImagesObjProps = {
  profileImage: {
    base64: 'https://i.imgur.com/ifKt2um.jpeg',
    preview: 'https://i.imgur.com/ifKt2um.jpeg',
    path: 'me-myself-and-irene.jpeg'
  },
  profileCover: {
    base64: 'https://i.imgur.com/zCdvhG0.jpg',
    preview: 'https://i.imgur.com/zCdvhG0.jpg',
    path: 'assets'
  },
}

export function usersProfileImagesObj(
  state = usersProfileImagesObjInitialState, 
  action: usersProfileImagesObjActionProps
) {
  const { type, image, imageType } = action;

  switch (type) {
    case 'setProfileImage':
      const tempUsersProfileImagesObj: any = { ...state };
      tempUsersProfileImagesObj[imageType] = { ...image };
      return tempUsersProfileImagesObj;
    default:
      return state;
  }

}

export function profileEditedInfos(
  state: profileEditedInfosObjProps = {
    profileName: 'Mitchell Verter',
    profileBio: 'Full-Stack Developer 👨‍💻 Lover of the cinematic arts🎬',
    profileUsername: 'mcverter',
    usersProfileImagesObj: usersProfileImagesObjInitialState
}, action: profileEditedInfosActionProps) {
  const { type, profileNameBio, usersProfileImagesObj } = action;

  switch (type) {
    case 'setProfileEditedInfos':
      const { profileName, profileBio, profileUsername } = profileNameBio;

      const tempProfileEditedInfos = {
        profileName: profileName,
        profileBio: profileBio,
        profileUsername: profileUsername,
        usersProfileImagesObj: { ...usersProfileImagesObj }
      }

      return tempProfileEditedInfos;

    default:
      return state;
  }

}