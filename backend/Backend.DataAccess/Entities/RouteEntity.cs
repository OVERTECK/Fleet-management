namespace Backend.DataAccess.Entities;

public class RouteEntity
{
    public required Guid Id { get; init; }

    public required DateTime Start { get; init; }

    public required DateTime End { get; init; }

    public required int CountKM { get; init; }
}