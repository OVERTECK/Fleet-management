using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using Backend.Tests.Common;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests;

public sealed class UsersRepositoryTests : TestCommandBase<UsersContextFactory>
{
    [Fact]
    public async Task GetByIdSuccessTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        
        // Act
        
        var result = await userRepository.GetById(UsersContextFactory.UserAId);

        // Assert

        Assert.NotNull(result);
        Assert.Equal(UsersContextFactory.UserAId, result.Id);
    }
    
    [Fact]
    public async Task GetByIdIsNullTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        
        // Act
        
        var result = await userRepository.GetById(Guid.NewGuid());

        // Assert

        Assert.Null(result);
    }
    
    [Fact]
    public async Task GetByLoginNotNullTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        
        // Act
        
        var result = await userRepository.GetByLogin(UsersContextFactory.UserALogin);

        // Assert
        
        Assert.NotNull(result);
    }
    
    [Fact]
    public async Task GetByLoginSuccessTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        var user = UsersContextFactory.Users[0];
        
        // Act
        
        var result = await userRepository.GetByLogin(UsersContextFactory.UserALogin);

        // Assert
        
        Assert.Equal(user.Id, result?.Id);
    }
    
    [Fact]
    public async Task CreateUserSuccessTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Login = "test",
            Password = "test",
            RoleId = 1,
        };
        
        // Act
        
        await userRepository.Create(user);

        // Assert
        
        Assert.NotNull(await Context.Users.FirstOrDefaultAsync(c => c.Id == user.Id));
    }
    
    [Fact]
    public async Task CreateUserFailTest()
    {
        // Arrange

        var userRepository = new UsersRepository(Context);
        var user = UsersContextFactory.Users[0];
        
        // Act
        // Assert
        
        await Assert.ThrowsAsync<InvalidOperationException>(async () => await userRepository.Create(user));
    }
}