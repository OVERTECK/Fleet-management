namespace Backend.DataAccess.Entities;

public class DriverEntity
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }

    public required string LastName { get; init; }

    public required string Pathronymic { get; init; }

    public required string ContactData { get; init; }

    public required string CategoryDrive { get; init; }
}