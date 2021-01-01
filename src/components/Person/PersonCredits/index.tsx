import {
  Container,
  PersonInfo
} from './styles';

export const PersonCredits = ({ personDetails }) => {

  const {
    also_known_as,
    birthday,
    place_of_birth,
    gender,
    moviesCount
  } = personDetails || {};

  const listOfPersonInfo = [
    {
      title: 'Gender',
      content: gender === '1' ? 'Male' : 'Female',
    },
    {
      title: 'Date of Birth',
      content: `
      ${new Date(birthday).toLocaleDateString('en-US', { dateStyle: 'long' })} 
      (${new Date().getFullYear() - new Date(birthday).getFullYear()} years old)`,
    },
    {
      title: 'Birthplace',
      content: place_of_birth,
    },
    {
      title: 'Appears in',
      content: moviesCount + 'movies',
    },
    {
      title: 'Also known as',
      content: also_known_as,
    },
  ]

  return (
    <Container>
      <h2>Personal Information</h2>
      {listOfPersonInfo.map(({ title, content }) => (

        <PersonInfo>
          <h3>{title}</h3>
          {content === also_known_as ? (
            content?.map((name) => (
              <p>{name}</p>
            ))
          ) : (
            <p>{content}</p>
          )}
        </PersonInfo>

      ))}
    </Container>
  );
};


