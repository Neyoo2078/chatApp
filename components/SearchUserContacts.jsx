import ContactList from './ContactList';

const SearchUserContacts = ({ SearchContact }) => {
  return (
    <div className="w-full p-1">
      {!SearchContact ? (
        <div className="w-full text-white flex items-center justify-center">
          {' '}
          <h1>No contact found</h1>
        </div>
      ) : (
        <div>
          {' '}
          {SearchContact.map((items, i) => (
            <ContactList items={items} i={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUserContacts;
