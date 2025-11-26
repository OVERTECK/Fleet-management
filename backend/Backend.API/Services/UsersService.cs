using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class UsersService(
    UsersRepository usersRepository,
    HashService hashService,
    JwtService jwtService)
{
    public async Task<string> Login(SignInRequest signInRequest)
    {
        var searchedUser = await usersRepository.GetByLogin(signInRequest.Login);

        if (searchedUser == null)
        {
            throw new NullReferenceException("User not found");
        }

        var hashedPassword = hashService.CreateHash(signInRequest.Password);

        if (hashedPassword != searchedUser.Password)
        {
            throw new UnauthorizedAccessException("Passwords do not match");
        }

        return jwtService.GetToken(searchedUser);
    }

    public async Task<UserEntity> GetByLogin(string login)
    {
        var searchedUser = await usersRepository.GetByLogin(login);

        if (searchedUser == null)
        {
            throw new NullReferenceException("User not found");
        }

        return searchedUser;
    }

    public async Task<UserEntity> GetById(Guid id)
    {
        var searchedUser = await usersRepository.GetById(id);

        if (searchedUser == null)
        {
            throw new NullReferenceException("User not found");
        }

        return searchedUser;
    }

    public async Task<string> SignUp(SignUpRequest signUpRequest)
    {
        var searchedUser = await usersRepository.GetByLogin(signUpRequest.Login);

        if (searchedUser != null)
        {
            throw new ArgumentException("User is already registered");
        }

        var hashedPassword = hashService.CreateHash(signUpRequest.Password);

        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Login = signUpRequest.Login,
            Password = hashedPassword,
            RoleId = signUpRequest.RoleId,
        };

        await usersRepository.Create(user);

        var createdUser = await usersRepository.GetByLogin(signUpRequest.Login);

        if (createdUser == null)
        {
            throw new NullReferenceException("User not found");
        }

        return jwtService.GetToken(createdUser);
    }
}