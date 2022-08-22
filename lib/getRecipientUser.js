const getRecipientUser = (users,LoggedInUser) => {
  return users.filter((userToGet) => userToGet !== LoggedInUser?.email)[0];
};

export default getRecipientUser;
